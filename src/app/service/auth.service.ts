import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:8000/api';

  constructor(private readonly http: HttpClient) {}

  signUp(signUpData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/signup`, signUpData);
  }

  checkEmailVerification(email: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/auth/check-email-verification`, {
      params: { email }
    });
  }
}