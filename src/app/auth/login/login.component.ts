import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;

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
      this.authService.login(this.loginForm.value).subscribe(
        (response: any) => {
          console.log('Login successful', response);
          console.log('Email:', response.email);
          console.log('id:', response.id);  // Display email in the console
  
          // Store the data in local storage
          localStorage.setItem('token', response.token); // Store the token in local storage
          localStorage.setItem('role', JSON.stringify(response.roles[0])); // Store the user role in local storage
          localStorage.setItem('username', response.username); 
          localStorage.setItem('email', response.email); 
          localStorage.setItem('id',response.id);
          // Navigate to the home page
          this.router.navigate(['/home']);
        },
        (error: any) => {
          console.error('Login error', error);
          // Handle login error (e.g., show a message to the user)
        }
      );
    }
  }
  
}
