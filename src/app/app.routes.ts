import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
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
import { LessonComponent } from './lesson/lesson.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { LogoutComponent } from './auth/logout/logout.component';
import { CategoriesComponent } from './categories/categories.component';
export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'logout', component: LogoutComponent },
  {
    path: '',
    component: NavbarComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'home', component: HomePageComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'courses', component: CoursesComponent },
      { path: 'library', component: LibraryComponent },
      { path: 'leaderboard', component: LeaderboardComponent },
    ],
  },
  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'ROLE_ADMIN' },
  },
  {
    path: 'course-details/:id',
    component: CoursesDetailsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'lesson/:lessonId',
    component: LessonComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'Managecategories',
    component: CategoriesComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'ROLE_ADMIN' },
  },
];
