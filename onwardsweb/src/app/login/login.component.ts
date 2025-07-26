import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginResponse } from '../models/login-response'; 
import { LoginService } from '../services/login-service.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
loginForm: FormGroup;
  errorMessage: string = '';
  username: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private loginService: LoginService
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onLogin(): void {
  if (this.loginForm.valid) {
    const username = this.loginForm.value.username;
    const password = this.loginForm.value.password;

    this.loginService.login(username, password).subscribe({
      next: (response: LoginResponse) => { 
        debugger
          if (response != null && response.employeeCode != null) {
            this.router.navigate(['/dashboard'], {
              queryParams: { 
                employeecode: response.employeeCode,
                fullname: response.fullName,
                email: response.email,
                rolename: response.roleName,
              }
            });
          } else {
            this.errorMessage = 'Unexpected login response.';
          } 
      },
      error: (err:any) => {
        if (err.status === 401) {
          this.errorMessage = 'Invalid username or password.';
        } else {
          this.errorMessage = 'An error occurred. Please try again.';
        }
        console.error('Login error:', err);
      }
    });
  }
}
}

