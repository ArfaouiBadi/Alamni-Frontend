import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { RouterOutlet } from '@angular/router';
import { UserService } from '../service/user.service';
import { User } from '../interface/user';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [NavbarComponent, RouterOutlet],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent implements OnInit {
  username: string | null = null;
  user: User | null = null;
  constructor(private userService: UserService) {}
  ngOnInit(): void {
    if (localStorage.getItem('username')) {
      this.username = localStorage.getItem('username');
    }
    this.userService.getUser(this.username!).subscribe((user) => {
      this.user = user;
      console.log(this.user);
    });
  }
}
