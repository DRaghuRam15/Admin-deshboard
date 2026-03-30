import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="user-management">
      <h1>User Management</h1>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let user of users">
            <td>{{ user.username }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.role }}</td>
            <td>
              <button (click)="changeRole(user._id, 'admin')" *ngIf="user.role !== 'admin'">Make Admin</button>
              <button (click)="changeRole(user._id, 'user')" *ngIf="user.role !== 'user'">Make User</button>
              <button (click)="deleteUser(user._id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .user-management { padding: 20px; }
    table { width: 100%; border-collapse: collapse; }
    th, td { border: 1px solid #ccc; padding: 10px; text-align: left; }
    button { margin-right: 5px; padding: 5px 10px; }
  `]
})
export class UserManagementComponent implements OnInit {
  users: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    const token = localStorage.getItem('token');
    this.http.get('http://localhost:5000/api/users', {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (data: any) => {
        this.users = data;
      },
      error: (err) => {
        console.error('Error fetching users', err);
      }
    });
  }

  changeRole(id: string, role: string) {
    const token = localStorage.getItem('token');
    this.http.put(`http://localhost:5000/api/users/${id}`, { role }, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: () => {
        this.loadUsers();
      },
      error: (err) => {
        console.error('Error updating user', err);
      }
    });
  }

  deleteUser(id: string) {
    const token = localStorage.getItem('token');
    this.http.delete(`http://localhost:5000/api/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: () => {
        this.loadUsers();
      },
      error: (err) => {
        console.error('Error deleting user', err);
      }
    });
  }
}