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

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
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

  constructor(private router: Router) {}

  ngOnInit(): void {
    if (typeof localStorage !== 'undefined') {
      this.username = localStorage.getItem('username');
      this.isUserLoggedIn = !!localStorage.getItem('token'); 

     
      const roles = JSON.parse(localStorage.getItem('roles') || '[]');
      if (roles.length > 0) {
        this.userRole = roles[0].name; 
      }
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
