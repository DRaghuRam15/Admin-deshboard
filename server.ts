import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import cookieParser from "cookie-parser";
import Database from "better-sqlite3";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";

// --- SQLite Initialization ---
const sqlite = new Database("dashboard.db");
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    role TEXT DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS analytics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT,
    active_users INTEGER,
    signups INTEGER,
    sales INTEGER
  );
`);

// --- Unified Data Access Layer ---
const DB = {
  async getUsers() {
    return sqlite.prepare("SELECT id as _id, username, role, created_at FROM users").all();
  },
  async findUser(username: string) {
    return sqlite.prepare("SELECT id as _id, username, password, role FROM users WHERE username = ?").get(username);
  },
  async createUser(data: any) {
    return sqlite.prepare("INSERT INTO users (username, password, role) VALUES (?, ?, ?)").run(data.username, data.password, data.role);
  },
  async deleteUser(id: string) {
    return sqlite.prepare("DELETE FROM users WHERE id = ?").run(id);
  },
  async getAnalytics() {
    return sqlite.prepare("SELECT * FROM analytics ORDER BY date ASC").all();
  }
};

// --- Seeding ---
async function seedData() {
  const hashedPassword = bcrypt.hashSync("admin123", 10);
  const sampleAnalytics = [
    { date: '2026-03-20', active_users: 400, signups: 24, sales: 2400 },
    { date: '2026-03-21', active_users: 300, signups: 13, sales: 2210 },
    { date: '2026-03-22', active_users: 200, signups: 98, sales: 2290 },
    { date: '2026-03-23', active_users: 278, signups: 39, sales: 2000 },
    { date: '2026-03-24', active_users: 189, signups: 48, sales: 2181 },
    { date: '2026-03-25', active_users: 239, signups: 38, sales: 2500 },
    { date: '2026-03-26', active_users: 349, signups: 43, sales: 2100 },
  ];

  if (!sqlite.prepare("SELECT * FROM users WHERE username = 'admin'").get()) {
    sqlite.prepare("INSERT INTO users (username, password, role) VALUES (?, ?, ?)").run("admin", hashedPassword, "admin");
  }
  if ((sqlite.prepare("SELECT COUNT(*) as count FROM analytics").get() as any).count === 0) {
    const insert = sqlite.prepare("INSERT INTO analytics (date, active_users, signups, sales) VALUES (?, ?, ?, ?)");
    sampleAnalytics.forEach(d => insert.run(d.date, d.active_users, d.signups, d.sales));
  }
}

seedData();

async function startServer() {
  const app = express();
  const PORT = 3000;
  app.use(express.json());
  app.use(cookieParser());

  app.get("/api/status", (req, res) => {
    res.json({ 
      status: "ok", 
      database: "sqlite",
      message: "Running on Local SQLite"
    });
  });

  app.post("/api/auth/login", async (req, res) => {
    const { username, password } = req.body;
    const user = await DB.findUser(username) as any;
    if (!user || !bcrypt.compareSync(password, user.password)) return res.status(401).json({ error: "Invalid credentials" });
    const token = jwt.sign({ id: user._id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: "1d" });
    res.cookie("token", token, { httpOnly: true, secure: true, sameSite: 'none' });
    res.json({ user: { id: user._id, username: user.username, role: user.role } });
  });

  app.post("/api/auth/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ success: true });
  });

  app.get("/api/auth/me", (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      res.json({ user: decoded });
    } catch (err) {
      res.status(401).json({ error: "Invalid token" });
    }
  });

  app.get("/api/analytics", async (req, res) => {
    const data = await DB.getAnalytics();
    res.json(data);
  });

  app.get("/api/users", async (req, res) => {
    const users = await DB.getUsers();
    res.json(users);
  });

  app.delete("/api/users/:id", async (req, res) => {
    const { id } = req.params;
    const users = await DB.getUsers() as any[];
    const user = users.find(u => String(u._id) === id);
    if (user?.username === 'admin') return res.status(400).json({ error: "Cannot delete primary admin" });
    await DB.deleteUser(id);
    res.json({ success: true });
  });

  app.post("/api/users", async (req, res) => {
    const { username, password, role } = req.body;
    try {
      const hashedPassword = bcrypt.hashSync(password, 10);
      await DB.createUser({ username, password: hashedPassword, role: role || 'user' });
      res.json({ success: true });
    } catch (err) {
      res.status(400).json({ error: "Username already exists" });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => res.sendFile(path.join(distPath, 'index.html')));
  }

  app.listen(PORT, "0.0.0.0", () => console.log(`Server running on http://localhost:${PORT}`));
}

startServer();
