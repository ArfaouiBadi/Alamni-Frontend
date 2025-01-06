import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { UserService } from '../service/user.service';
import { User } from '../interface/user';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  animations: [
    trigger('switchAnimation', [
      state('learn', style({ opacity: 1 })),
      state('courses', style({ opacity: 1 })),
      state('home', style({ opacity: 1 })),
      transition('* => *', [
        style({ opacity: 0 }),
        animate('0.5s ease-in-out'),
      ]),
    ]),
  ],
})
export class NavbarComponent implements OnInit {
  username: string | null = null;
  currentView: string = 'learn';
  isUserLoggedIn: boolean = false;
  userRole: string | null = null;
  userId: string | null = localStorage.getItem('id');
  userLoggedin: User | null = null;

  constructor(
    private readonly router: Router,
    private readonly userService: UserService
  ) {}

  ngOnInit(): void {
    if (typeof localStorage !== 'undefined') {
      this.username = localStorage.getItem('username');
      this.isUserLoggedIn = !!localStorage.getItem('token');
      if (this.username) {
        this.userService.getUser(this.username).subscribe((user) => {
          this.userLoggedin = user;
        });
      }
      const roles = JSON.parse(localStorage.getItem('role') || '[]');
      this.userRole = roles;
    }
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  switchView(view: string) {
    this.currentView = view;
  }
}
