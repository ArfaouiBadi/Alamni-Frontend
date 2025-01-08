import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../service/user.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import Swal from 'sweetalert2'; // Import SweetAlert2

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

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
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
      level: [1, Validators.required],
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
    console.log('Registering user', this.addUserForm.value);
    console.log('Form validity', this.addUserForm.valid);
    if (this.addUserForm.valid) {
      this.authService.signUp(this.addUserForm.value).subscribe(
        (response: any) => {
          console.log('User registered successfully', response);
          Swal.fire('Success', 'User registered successfully. Please verify your email.', 'success');
        },
        (error: any) => {
          console.error('Error registering user', error);
          Swal.fire('Error', 'Failed to register user. Please try again.', 'error');
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
            Swal.fire('Success', 'Email verified successfully.', 'success');
          } else {
            Swal.fire('Error', 'Email verification failed.', 'error');
          }
        },
        (error: any) => {
          console.error('Error verifying email', error);
          Swal.fire('Error', 'Failed to verify email. Please try again.', 'error');
        }
      );
    }
  }

  confirmDeleteUser(id: number): void {
    this.userIdToDelete = id; // Store the user ID to delete
    this.deleteUser();
  }

  deleteUser(): void {
    if (this.userIdToDelete !== null) {  // Ensure it's not null before proceeding
      const userId = this.userIdToDelete; // Now we are certain it's a number
      Swal.fire({
        title: 'Are you sure?',
        text: 'You won’t be able to revert this!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, keep it',
      }).then((result) => {
        if (result.isConfirmed) {
        
          this.userService.deleteUser(userId).subscribe(
            () => {
              console.log('User deleted successfully');
              this.users = this.users.filter((user) => user.id !== userId);
              this.userIdToDelete = null; 
              Swal.fire('Deleted!', 'User has been deleted.', 'success');
            },
            (error: any) => {
              console.error('Error deleting user', error);
              Swal.fire('Error', 'Failed to delete user. Please try again.', 'error');
              this.userIdToDelete = null; 
            }
          );
        } else {
          this.userIdToDelete = null;
        }
      });
    }
  }
  editUser(user: any): void {
    Swal.fire({
      title: 'Edit User Points and Level',
      html: `
        <label for="level">Level:</label>
        <input type="number" id="level" class="swal2-input" value="${user.level}"><br>
        <label for="points">Points:</label>
        <input type="number" id="points" class="swal2-input" value="${user.points}">
      `,
      showCancelButton: true,
      confirmButtonText: 'Update',
      preConfirm: () => {
        const levelInput = (<HTMLInputElement>document.getElementById('level')).value;
        const pointsInput = (<HTMLInputElement>document.getElementById('points')).value;

        if (!levelInput || !pointsInput) {
          Swal.showValidationMessage('Both fields are required');
        }

        return {
          level: parseInt(levelInput, 10),
          points: parseInt(pointsInput, 10),
        };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const updates = {
          level: result.value?.level,
          points: result.value?.points,
        };

        this.userService.updateUserLevelAndPoints(user.id, updates).subscribe(
          (response) => {
            Swal.fire('Updated!', 'User points and level have been updated.', 'success');
            // Update the local users array
            const updatedUserIndex = this.users.findIndex((u) => u.id === user.id);
            if (updatedUserIndex !== -1) {
              this.users[updatedUserIndex].level = updates.level;
              this.users[updatedUserIndex].points = updates.points;
            }
          },
          (error) => {
            console.error('Error updating user:', error);
            Swal.fire('Error', 'Failed to update user. Please try again.', 'error');
          }
        );
      }
    });
  }
  
  
}
