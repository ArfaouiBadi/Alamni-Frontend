import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredRole = route.data['role'];
    const userRole = JSON.parse(localStorage.getItem('role') || 'null');

    if (userRole === requiredRole) {
      return true;
    } else {
      this.router.navigate(['/home']);
      return false;
    }
  }
}
