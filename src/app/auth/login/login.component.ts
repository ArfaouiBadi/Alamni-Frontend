import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { RouterModule } from '@angular/router';

import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../service/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading: boolean = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.authService.login(this.loginForm.value).subscribe(
        (response: any) => {
          console.log('Login successful', response);
          console.log('Email:', response.email);
          console.log('id:', response.id); // Display email in the console

          // Store the data in local storage
          localStorage.setItem('token', response.token); // Store the token in local storage
          localStorage.setItem('role', JSON.stringify(response.roles[0])); // Store the user role in local storage
          localStorage.setItem('username', response.username);
          localStorage.setItem('email', response.email);
          localStorage.setItem('id', response.id);

          // Check if the email is verified
          this.authService.checkEmailVerification(response.email).subscribe({
            next: (verificationResponse) => {
              if (verificationResponse.enabled) {
                // Navigate to the home page
                this.router.navigate(['/home']);
              } else {
                Swal.fire({
                  title: 'Verification Pending',
                  text: 'Your email is not verified yet. Please check your email for verification instructions.',
                  icon: 'warning',
                  confirmButtonText: 'OK',
                });
              }
            },
            error: (err: any) => {
              this.isLoading = false;
              Swal.fire({
                title: 'Error!',
                text: 'Failed to check verification status. Please try again.',
                icon: 'error',
                confirmButtonText: 'OK',
              });
            },
          });
        },
        (error: any) => {
          this.isLoading = false;
          console.error('Login error', error);

          // Show SweetAlert if the password is incorrect
          if (error.status === 401) {
            Swal.fire({
              title: 'Error!',
              text: 'Invalid credentials, please check your email and password.',
              icon: 'error',
              confirmButtonText: 'OK',
            });
          } else {
            // Handle other types of errors if necessary
            Swal.fire({
              title: 'Error!',
              text: 'An unexpected error occurred. Please try again later.',
              icon: 'error',
              confirmButtonText: 'OK',
            });
          }
        }
      );
    }
  }
  cancelLoading(): void {
    this.isLoading = false;
  }
}
