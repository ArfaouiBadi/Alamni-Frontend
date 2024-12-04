import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../service/user.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // Import CommonModule and ReactiveFormsModule here
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css'],
})
export class UsersListComponent implements OnInit {
  users: any[] = [];
  addUserForm: FormGroup;
  isEmailVerified: boolean = false;

  constructor(private userService: UserService, private fb: FormBuilder) {
    this.addUserForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(20)]],
      lastName: ['', [Validators.required, Validators.maxLength(20)]],
      email: [
        '',
        [Validators.required, Validators.email, Validators.maxLength(50)],
      ],
      username: ['', [Validators.required, Validators.maxLength(20)]],
      password: ['', [Validators.required, Validators.maxLength(120)]],
      dateOfBirth: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.userService.getUsers().subscribe(
      (data: any) => {
        console.log('Users fetched successfully', data);
        this.users = data;
      },
      (error: any) => {
        console.error('Error fetching users', error);
      }
    );
  }

  registerUser(): void {
    if (this.addUserForm.valid) {
      this.userService.registerUser(this.addUserForm.value).subscribe(
        (response: any) => {
          console.log('User registered successfully', response);
          alert('User registered successfully. Please verify your email.');
        },
        (error: any) => {
          console.error('Error registering user', error);
        }
      );
    }
  }

  verifyEmail(): void {
    const email = this.addUserForm.get('email')?.value;
    if (email) {
      this.userService.verifyEmail(email).subscribe(
        (response: any) => {
          if (response.verified) {
            this.isEmailVerified = true;
            alert('Email verified successfully.');
          } else {
            alert('Email verification failed.');
          }
        },
        (error: any) => {
          console.error('Error verifying email', error);
        }
      );
    }
  }

  deleteUser(id: number): void {
    const confirmed = confirm('Are you sure you want to delete this user?');
    if (confirmed) {
      this.userService.deleteUser(id).subscribe(
        () => {
          console.log('User deleted successfully');
          this.users = this.users.filter((user) => user.id !== id);
        },
        (error: any) => {
          console.error('Error deleting user', error);
        }
      );
    }
  }
}
