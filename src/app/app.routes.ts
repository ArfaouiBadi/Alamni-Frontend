import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { HomePageComponent } from './home-page/home-page.component';

export const routes: Routes = [
    {path:'login',component:LoginComponent},
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    {path:'signup',component:SignupComponent},
    {path:'home',component:HomePageComponent}
];
