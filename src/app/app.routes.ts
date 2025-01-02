import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SignUpComponent } from './auth/signup/signup.component';
import { HomePageComponent } from './home-page/home-page.component';
import { UsersListComponent } from './users/users-list/users-list.component';

import { NavbarComponent } from './navbar/navbar.component';

import { ProfileComponent } from './profile/profile.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { LandingPageComponent } from './landing-page/landing-page.component';

import { CoursesListComponent } from './courses/courses-list/courses-list.component';
import { CoursesComponent } from './courses/course/courses.component';
import { CoursesDetailsComponent } from './courses/courses-details/courses-details.component';
import { LibraryComponent } from './library/library.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';

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
      { path: 'library', component: LibraryComponent },
      { path: 'leaderboard', component: LeaderboardComponent },
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
    children: [
      { path: 'library', component: LibraryComponent },
      { path: 'leaderboard', component: LeaderboardComponent },
    ],
  },
  {
    path: 'courses-admin',
    component: CoursesListComponent,
  },
  {
    path: 'course-details/:id',
    component: CoursesDetailsComponent,
  },
];
