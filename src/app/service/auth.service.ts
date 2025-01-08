import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:8000/api';

  constructor(private readonly http: HttpClient) {}

  login(loginData: any): Observable<any> {
    console.log('loginData', loginData);
    return this.http.post(`${this.apiUrl}/auth/signin`, loginData);
  }

  signUp(signUpData: any): Observable<any> {
    console.log('signUpData', signUpData);
    return this.http.post(`${this.apiUrl}/auth/signup`, signUpData);
  }

  checkEmailVerification(email: string): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/auth/${email}/check-email-verification`
    );
  }
}
