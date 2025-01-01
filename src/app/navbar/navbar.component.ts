import { Component, OnInit } from '@angular/core';
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
  styleUrl: './navbar.component.css',
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
  ngOnInit(): void {
    if (typeof localStorage !== 'undefined') {
      this.username = localStorage.getItem('username');
    }
  }
  switchView(view: string) {
    this.currentView = view;
  }
}
