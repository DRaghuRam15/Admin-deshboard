import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <div class="login-container">
      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
        <h2>Login</h2>
        <div>
          <label for="email">Email:</label>
          <input type="email" id="email" formControlName="email" required>
        </div>
        <div>
          <label for="password">Password:</label>
          <input type="password" id="password" formControlName="password" required>
        </div>
        <button type="submit" [disabled]="loginForm.invalid">Login</button>
      </form>
    </div>
  `,
  styles: [`
    .login-container { max-width: 400px; margin: 50px auto; padding: 20px; border: 1px solid #ccc; border-radius: 5px; }
    form div { margin-bottom: 15px; }
    label { display: block; margin-bottom: 5px; }
    input { width: 100%; padding: 8px; }
    button { width: 100%; padding: 10px; background: #007bff; color: white; border: none; border-radius: 5px; }
    button:disabled { background: #ccc; }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.http.post('http://localhost:5000/api/auth/login', this.loginForm.value)
        .subscribe({
          next: (response: any) => {
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
            this.router.navigate(['/dashboard']);
          },
          error: (err) => {
            alert('Login failed');
          }
        });
    }
  }
}