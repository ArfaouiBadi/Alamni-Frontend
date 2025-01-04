import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course } from '../interface/course';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {
  private apiUrl = 'http://localhost:8000/api/enrollments/user';

  constructor(private http: HttpClient) { }

  getCoursesByUserId(userId: string): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/${userId}/courses`);
  }
  getLastUnfinishedCourseByUserId(userId: string): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}/${userId}/last-unfinished-course`);
  }
  getTotalEnrollmentCount(): Observable<number> {
    return this.http.get<number>('http://localhost:8000/api/enrollments/total-enrollment-count');
  }
  getUnfinishedCoursesByUserId(userId: string): Observable<{ name: string, description: string, imageUrl: string }[]> {
    return this.http.get<{ name: string, description: string, imageUrl: string }[]>(`${this.apiUrl}/${userId}/unfinished-courses`);
  }

  getFinishedCoursesByUserId(userId: string): Observable<{ name: string, description: string, imageUrl: string }[]> {
    return this.http.get<{ name: string, description: string, imageUrl: string }[]>(`${this.apiUrl}/${userId}/finished-courses`);
  }
}