import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SignUpComponent } from './auth/signup/signup.component';
import { HomePageComponent } from './home-page/home-page.component';
import { UsersListComponent } from './users/users-list/users-list.component';

import { NavbarComponent } from './navbar/navbar.component';

import { ProfileComponent } from './profile/profile.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { CoursesComponent } from './courses/courses.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: NavbarComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomePageComponent },
      { path: 'courses', component: CoursesComponent },
      { path: 'profile', component: ProfileComponent },
    ],
  },
  { path: 'signup', component: SignUpComponent },
  { path: 'home', component: LandingPageComponent },
  { path: 'ManageUsers', component: UsersListComponent },
  { path: 'navbar', component: NavbarComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'admin-dashboard', component: AdminDashboardComponent },
  {
    path: 'courses',
    component: CoursesComponent,
  },
];
