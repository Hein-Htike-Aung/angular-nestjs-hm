import { Observable, take } from 'rxjs';
import { Category } from './../models/category.model';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';

const API_URL = `${environment.API}/category`;

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private http: HttpClient) {}

  createCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(`${API_URL}`, category).pipe(take(1));
  }

  updateCategory(id: number, category: Category): Observable<Category> {
    return this.http
      .patch<Category>(`${API_URL}/${id}`, category)
      .pipe(take(1));
  }

  deleteCategory(id: number): Observable<Category> {
    return this.http.delete<Category>(`${API_URL}/${id}`).pipe(take(1));
  }

  findById(id: number): Observable<Category> {
    return this.http.get<Category>(`${API_URL}/${id}`).pipe(take(1));
  }

  findAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${API_URL}`);
  }
}
