import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Course } from '../interface/course';
import { Category } from '../interface/category';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private readonly apiUrl = 'http://localhost:8000/api';

  constructor(private readonly http: HttpClient) {}

  addCourse(courseData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/courses`, courseData);
  }
  getCourseById(id: string): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}/courses/${id}`);
  }
  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/courses`).pipe(
      map((courses: Course[]) => {
        return courses.map((course) => {
          return course;
        });
      })
    );
  }
  updateCourse(course: Course): Observable<any> {
    console.log('service update' + course.id);
    return this.http.put(`${this.apiUrl}/courses`, course);
  }

  deleteCourse(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/courses/${id}`);
  }
  getTotalCourses(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/courses/count`);
  }
  getCoursesPerCategory(): Observable<{ category: string; count: number }[]> {
    return this.http.get<{ category: string; count: number }[]>(
      `${this.apiUrl}/courses/courses-per-category`
    );
  }
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories`);
  }
  enrollCourse(courseId: string, userId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/enroll`, { userId, courseId });
  }

  
}
