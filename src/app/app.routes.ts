import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SignUpComponent } from './auth/signup/signup.component';
import { HomePageComponent } from './home-page/home-page.component';
import { CoursesListComponent } from './courses/courses-list/courses-list.component';
import { AddCourseComponent } from './courses/add-course/add-course.component';
import { UsersListComponent } from './users/users-list/users-list.component';
import { CoursesDetailsComponent } from './courses/courses-details/courses-details.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomePage2Component } from './home-page2/home-page2.component';
import { ProfileComponent } from './profile/profile.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'signup', component: SignUpComponent },
  { path: 'home', component: HomePage2Component },
  { path: 'ManageCourses', component: CoursesListComponent },
  { path: 'AddCourse', component: AddCourseComponent },
  { path: 'ManageUsers', component: UsersListComponent },
  {path:'course-detail/:id',component:CoursesDetailsComponent},
  {path:'navbar',component:NavbarComponent},
  {path:'profile',component:ProfileComponent},
  {path:'admin-dashboard',component:AdminDashboardComponent}
];
