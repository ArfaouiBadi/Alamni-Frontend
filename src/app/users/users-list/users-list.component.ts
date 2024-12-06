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
  userIdToDelete: number | null = null; // Store the user ID to delete

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
      level: [0, Validators.required],
      points: [0, Validators.required],
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
    console.log(this.addUserForm.value);
    console.log(this.addUserForm.valid);
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

  confirmDeleteUser(id: number): void {
    this.userIdToDelete = id; // Store the user ID to delete
  }

  deleteUser(): void {
    if (this.userIdToDelete !== null) {
      this.userService.deleteUser(this.userIdToDelete).subscribe(
        () => {
          console.log('User deleted successfully');

          this.users = this.users.filter(
            (user) => user.id !== this.userIdToDelete
          );
          this.userIdToDelete = null; // Reset the user ID to delete
        },
        (error: any) => {
          console.error('Error deleting user', error);
          alert('Error deleting user.');
          this.userIdToDelete = null; // Reset the user ID to delete
        }
      );
    }
  }
}
