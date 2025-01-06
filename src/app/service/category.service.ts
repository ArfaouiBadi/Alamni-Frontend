import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../interface/category';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly apiUrl = 'http://localhost:8000/api';

  constructor(private readonly http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories`);
  }
  
  getTotalCategories(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/categories/count`);
  }
  createCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, category, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }
  updateCategory(id: string, category: Category): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/${id}`, category, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }
  deleteCategory(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
