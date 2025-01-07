import { Component, OnInit } from '@angular/core';
import { UserService } from '../service/user.service';
import { NavbarComponent } from "../navbar/navbar.component";  
import Swal from 'sweetalert2'; 
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports: [NavbarComponent, FormsModule]
})
export class ProfileComponent implements OnInit {
  username: string | null = null;
  email: string | null = null;
  id: string | null = null;
  user: any = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.id = localStorage.getItem('id');

    if (this.id) {
      this.userService.getUserById(this.id).subscribe(
        (data) => {
          this.user = data; 
          console.log('User data:', this.user);  
          this.username = this.user.username;
          this.email = this.user.email;
        },
        (error) => {
          console.error('Error fetching user data:', error);
        }
      );
    }
  }

  updateProfile(): void {
    if (this.id) {  
      const updatedData = {
        firstName: this.user.firstName,
        lastName: this.user.lastName
      };

      this.userService.updateUserName(this.id, updatedData).subscribe(
        (response) => {
          console.log('User updated successfully:', response);
          Swal.fire('Success!', 'Profile updated successfully!', 'success');
        },
        (error) => {
          console.error('Error updating user:', error);
          Swal.fire('Error!', 'An error occurred while updating your profile.', 'error');
        }
      );
    } else {
      console.error('User ID is null');
      Swal.fire('Error!', 'User ID is missing.', 'error');
    }
  }
}
