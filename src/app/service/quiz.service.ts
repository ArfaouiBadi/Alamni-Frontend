import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  private readonly apiUrl = 'http://127.0.0.1:5000/generate-quiz';

  constructor(private readonly http: HttpClient) {}
  // startQuiz(courseDetail: string, type: string): Observable<any> {
  //   if (type === 'PDF') {
  //     return this.http.post(`${this.apiUrl}`, { pdf_url: courseDetail });
  //   }
  //   return this.http.post(`${this.apiUrl}`, { course_name: courseDetail });
  // }

  uploadPdf(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    console.log('Uploading file:', file);
    return this.http.post('http://127.0.0.1:5000/upload-pdf', formData);
  }
  startQuiz(username: string): Observable<any> {
    return this.http.post('http://127.0.0.1:5000/start-quiz', { username });
  }
}
