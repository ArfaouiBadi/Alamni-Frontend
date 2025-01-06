import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../interface/category';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly apiUrl = 'http://localhost:8000/api/categories';

  constructor(private readonly http: HttpClient) {}

  // Fetch all categories
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}`);
  }

  // Fetch total number of categories
  getTotalCategories(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count`); // Ensure backend route exists
  }

  // Create a new category
  createCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(`${this.apiUrl}`, category, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }

  // Update an existing category
  updateCategory(id: string, category: Category): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/${id}`, category, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }

  // Delete a category
  deleteCategory(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
