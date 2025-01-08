import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../service/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signupForm = this.fb.group(
      {
        username: ['', Validators.required],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  ngOnInit(): void {}

  passwordMatchValidator(formGroup: FormGroup) {
    return formGroup.get('password')!.value ===
      formGroup.get('confirmPassword')!.value
      ? null
      : { mismatch: true };
  }

  onSubmit(): void {
    if (this.signupForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.authService.signUp(this.signupForm.value).subscribe({
      next: (response: any) => {
        Swal.fire({
          title: 'Success!',
          text: 'Signup successful. Please check your email for verification.',
          icon: 'success',
          confirmButtonText: 'OK',
        }).then(() => {
          this.checkVerificationStatus();
        });
      },
      error: (err) => {
        this.isLoading = false;
        Swal.fire({
          title: 'Error!',
          text: err.error.message || 'Signup failed. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      },
    });
  }

  checkVerificationStatus(): void {
    console.log('Checking verification status');
    console.log('Form:', this.signupForm.value);
    console.log('Email:', this.signupForm.value.email);
    this.authService
      .checkEmailVerification(this.signupForm.value.email)
      .subscribe({
        next: (response) => {
          console.log('Verification status:', response);
          if (response.enabled) {
            this.router.navigate(['/login']);
          } else {
            Swal.fire({
              title: 'Verification Pending',
              text: 'Your email is not verified yet. Please check your email for verification instructions.',
              icon: 'warning',
              confirmButtonText: 'OK',
            });
          }
        },
        error: (err) => {
          Swal.fire({
            title: 'Error!',
            text: 'Failed to check verification status. Please try again.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        },
      });
  }
  cancelLoading(): void {
    this.isLoading = false;
  }
}
