import { HttpErrorResponse } from '@angular/common/http';

/** Turns an API error response into a message that can be shown to the user. */
export function apiErrorMessage(err: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (!(err instanceof HttpErrorResponse)) {
    return fallback;
  }
  if (err.status === 0) {
    return 'Cannot reach the server. Check that the API is running.';
  }
  const body = err.error;
  if (body && typeof body === 'object') {
    if (typeof body.error === 'string') {
      return body.error;
    }
    if (typeof body.message === 'string') {
      return body.message;
    }
    if (body.error && typeof body.error.message === 'string') {
      return body.error.message;
    }
  }
  return fallback;
}
