import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Course {
  id?: string;
  title: string;
  description: string;
  levelRequired: string;
  duration: number;
  category: string;
}

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private apiUrl = 'http://localhost:8000/api/courses';

  constructor(private http: HttpClient) {}

 
  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.apiUrl);
  }

 
  getCourseById(id: string): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}/${id}`);
  }

 
  addCourse(course: Course): Observable<Course> {
    return this.http.post<Course>(this.apiUrl, course);
  }

 
  updateCourse(id: string, course: Course): Observable<Course> {
    return this.http.put<Course>(`${this.apiUrl}/${id}`, course);
  }


  deleteCourse(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
