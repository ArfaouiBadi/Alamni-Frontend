import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { RewardSystem } from '../interface/reward-system';

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
  getUserById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/${id}`);
  }
  getUser(username: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/username/${username}`);
  }
  getTotalUsers(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/users/count`);
  }
  getTotalEnrolledCourses(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/users/total-enrolled-courses`);
  }
  getUsersByAgeGroup(): Observable<Map<string, number>> {
    return this.http.get<Map<string, number>>(
      `${this.apiUrl}/users/age-distribution`
    );
  }
  updateUserName(id: string, userData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${id}/update-name`, userData);
  }
  updateUserRewards(id: string, rewardData: RewardSystem): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/${id}/rewards`, rewardData);
  }
}
