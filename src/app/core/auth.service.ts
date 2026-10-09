import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { RegisterInput, User } from './models';

const TOKEN_KEY = 'expense_management_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = `${environment.apiUrl}/user`;
  private readonly userSubject = new BehaviorSubject<User | null>(null);

  /** The logged-in user, or null before the profile has loaded. */
  readonly user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {}

  get token(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  }

  get isLoggedIn(): boolean {
    return this.token !== null;
  }

  register(input: RegisterInput): Observable<void> {
    return this.http.post(`${this.api}/register`, input).pipe(map(() => undefined));
  }

  login(email: string, password: string): Observable<void> {
    return this.http.post<{ token: string }>(`${this.api}/login`, { email, password }).pipe(
      tap((res) => this.storeToken(res.token)),
      map(() => undefined)
    );
  }

  loadProfile(): Observable<User> {
    return this.http.get<{ user: User }>(`${this.api}/me`).pipe(
      map((res) => res.user),
      tap((user) => this.userSubject.next(user))
    );
  }

  setMonthlyIncome(monthlyIncome: number): Observable<void> {
    return this.http.post(`${this.api}/income`, { monthlyIncome }).pipe(
      tap(() => {
        const user = this.userSubject.value;
        if (user) {
          this.userSubject.next({ ...user, monthlyIncome });
        }
      }),
      map(() => undefined)
    );
  }

  /** Ends the session on the server, then locally. */
  logout(): Observable<void> {
    return this.http.post(`${this.api}/logout`, {}).pipe(
      map(() => undefined),
      tap({ next: () => this.clearSession(), error: () => this.clearSession() })
    );
  }

  /** Forgets the token without calling the server, e.g. after it expired. */
  clearSession(): void {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {
      // storage unavailable: nothing to remove
    }
    this.userSubject.next(null);
  }

  private storeToken(token: string): void {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch {
      // storage unavailable: the session lasts until the page reloads
    }
  }
}
