import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

/** Sends the token with API requests and returns to the login page when it is rejected. */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService, private router: Router) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.auth.token;
    const isApiRequest = req.url.startsWith(environment.apiUrl);
    const request =
      token && isApiRequest ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

    return next.handle(request).pipe(
      catchError((err: unknown) => {
        const hadSession = token !== null;
        if (err instanceof HttpErrorResponse && err.status === 401 && isApiRequest && hadSession) {
          this.auth.clearSession();
          this.router.navigate(['/login'], { queryParams: { expired: 1 } });
        }
        return throwError(() => err);
      })
    );
  }
}
