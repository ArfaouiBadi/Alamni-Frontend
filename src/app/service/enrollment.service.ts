import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Course } from '../interface/course';
import { Enrollment } from '../interface/Enrollment';

@Injectable({
  providedIn: 'root',
})
export class EnrollmentService {
  private apiUrl = 'http://localhost:8000/api/enrollments';

  constructor(private http: HttpClient) {}

  getEnrollmentsByUserId(userId: string): Observable<Enrollment[]> {
    console.log('getEnrollmentsByUserId');
    return this.http.get<Enrollment[]>(
      `${this.apiUrl}/user/${userId}/enrollments`
    );
  }
  getEnrollments(): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/total-enrollment-count`);
  }
}
