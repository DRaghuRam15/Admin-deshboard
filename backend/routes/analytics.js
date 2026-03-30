const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();

// Get analytics data (authenticated users)
router.get('/', auth, (req, res) => {
  // Mock data for demonstration
  const data = {
    activeUsers: 1250,
    signUps: 150,
    sales: 50000,
    charts: {
      userGrowth: [
        { month: 'Jan', users: 100 },
        { month: 'Feb', users: 200 },
        { month: 'Mar', users: 350 },
        { month: 'Apr', users: 500 },
        { month: 'May', users: 750 },
        { month: 'Jun', users: 1000 },
      ],
      salesData: [
        { month: 'Jan', sales: 10000 },
        { month: 'Feb', sales: 15000 },
        { month: 'Mar', sales: 20000 },
        { month: 'Apr', sales: 25000 },
        { month: 'May', sales: 30000 },
        { month: 'Jun', sales: 35000 },
      ],
    },
  };
  res.json(data);
});

module.exports = router;