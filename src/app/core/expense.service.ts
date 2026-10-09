import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { CategoryStatistics, Expense, ExpenseInput, MonthlyExpenses, MonthlyStatistics, Period } from './models';

@Injectable({ providedIn: 'root' })
export class ExpenseService {
  private readonly api = `${environment.apiUrl}/expense`;

  constructor(private http: HttpClient) {}

  list(period: Period): Observable<MonthlyExpenses> {
    return this.http.get<MonthlyExpenses>(`${this.api}/monthly_expenses`, { params: this.params(period) });
  }

  statistics(period: Period): Observable<MonthlyStatistics> {
    return this.http.get<MonthlyStatistics>(`${this.api}/monthly_statics`, { params: this.params(period) });
  }

  byCategory(period: Period): Observable<CategoryStatistics> {
    return this.http.get<CategoryStatistics>(`${this.api}/expense_type_statistics`, {
      params: this.params(period),
    });
  }

  create(input: ExpenseInput): Observable<Expense> {
    return this.http.post<{ expense: Expense }>(`${this.api}/create`, input).pipe(map((res) => res.expense));
  }

  update(id: string, input: ExpenseInput): Observable<Expense> {
    return this.http.put<{ expense: Expense }>(`${this.api}/${id}`, input).pipe(map((res) => res.expense));
  }

  remove(id: string): Observable<void> {
    return this.http.delete(`${this.api}/${id}`).pipe(map(() => undefined));
  }

  private params(period: Period): HttpParams {
    return new HttpParams().set('month', period.month).set('year', period.year);
  }
}
