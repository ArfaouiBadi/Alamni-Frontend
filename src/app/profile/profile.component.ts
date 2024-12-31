import { Component, OnInit } from '@angular/core';
import { UserService } from '../service/user.service';
import { NavbarComponent } from "../navbar/navbar.component";  // Import the UserService

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports: [NavbarComponent]
})
export class ProfileComponent implements OnInit {
  username: string | null = null;
  email: string | null = null;
  id: string | null = null;
  user: any = null;  // To hold user data

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
}
