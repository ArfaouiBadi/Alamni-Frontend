import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  ReactiveFormsModule,
} from '@angular/forms';

import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignUpComponent {
  signUpForm: FormGroup;
  message: string = '';
  isVerified: boolean = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router,
    private toastr: ToastrService
  ) {
    this.signUpForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      birthDate: ['', [Validators.required, this.ageValidator]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  // Custom validator for birth date to check age (16 or older)
  ageValidator(control: AbstractControl): ValidationErrors | null {
    const birthDate = control.value;
    if (!birthDate) return null;

    const today = new Date();
    const birthDateObj = new Date(birthDate);
    const age = today.getFullYear() - birthDateObj.getFullYear();
    const month = today.getMonth() - birthDateObj.getMonth();
    
    // Check if the user is 16 years old or older
    if (age > 16 || (age === 16 && month >= 0)) {
      return null; // Valid age
    } else {
      return { ageTooYoung: true }; // Age is under 16
    }
  }

  onSubmit() {
    if (this.signUpForm.valid) {
      this.authService.signUp(this.signUpForm.value).subscribe(
        (response: any) => {
          console.log('Sign up successful', response);
          this.message = 'Sign up successful! Please verify your email.';
          this.toastr.success('Sign up successful! Please verify your email.');
        },
        (error: any) => {
          console.error('Sign up error', error);
          this.message = 'Sign up failed. Please try again.';
          this.toastr.error('Sign up failed. Please try again.');
        }
      );
    }
  }

  checkVerificationStatus() {
    const email = this.signUpForm.get('email')?.value;
    if (email) {
      this.authService.checkEmailVerification(email).subscribe(
        (response: any) => {
          console.log('Verification check response', response.enabled);
          if (response.enabled) {
            this.isVerified = true;
            console.log('Email is verified.', response);
            this.toastr.success('Email is verified.');
          }
        },
        (error: any) => {
          console.error('Verification check error', error);
          this.toastr.error('Verification check error');
        }
      );
    } else {
      console.error('Email is required to check verification status.');
      this.toastr.error('Email is required to check verification status.');
    }
  }

  onEmailVerified() {
    this.router.navigate(['/login']);
  }
}
