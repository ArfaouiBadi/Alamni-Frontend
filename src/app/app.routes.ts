import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { HomePageComponent } from './home-page/home-page.component';
import { CoursesListComponent } from './courses/courses-list/courses-list.component';
import { AddCourseComponent } from './courses/add-course/add-course.component';
import { UsersListComponent } from './users/users-list/users-list.component';

export const routes: Routes = [
    {path:'login',component:LoginComponent},
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    {path:'signup',component:SignupComponent},
    {path:'home',component:HomePageComponent},
    {path:'ManageCourses',component:CoursesListComponent},
    {path:'AddCourse',component:AddCourseComponent},
    {path:'ManageUsers',component:UsersListComponent}
];
