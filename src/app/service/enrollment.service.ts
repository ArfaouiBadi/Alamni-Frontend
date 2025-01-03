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
}
