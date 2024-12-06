import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  private readonly apiUrl = 'http://127.0.0.1:5000/generate-quiz';

  constructor(private readonly http: HttpClient) {}
  startQuiz(courseDetail: string): Observable<any> {
    return this.http.post(`${this.apiUrl}`, { course_name: courseDetail });
  }
}
