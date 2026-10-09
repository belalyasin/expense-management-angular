import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { Category } from './models';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly api = `${environment.apiUrl}/category`;

  constructor(private http: HttpClient) {}

  list(): Observable<Category[]> {
    return this.http.get<{ categories: Category[] }>(this.api).pipe(map((res) => res.categories));
  }

  create(name: string, description: string): Observable<Category> {
    return this.http
      .post<{ category: Category }>(`${this.api}/create`, { name, description })
      .pipe(map((res) => res.category));
  }

  update(id: string, name: string, description: string): Observable<Category> {
    return this.http
      .put<{ category: Category }>(`${this.api}/${id}`, { name, description })
      .pipe(map((res) => res.category));
  }

  remove(id: string): Observable<void> {
    return this.http.delete(`${this.api}/${id}`).pipe(map(() => undefined));
  }
}
