import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly apiUrl = 'http://localhost:8000/api';

  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService
  ) {}

  getUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users`);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${id}`);
  }

  registerUser(userData: any): Observable<any> {
    return this.authService.signUp(userData);
  }

  verifyEmail(email: string): Observable<any> {
    return this.authService.checkEmailVerification(email);
  }
}
