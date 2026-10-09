import { HttpErrorResponse } from '@angular/common/http';
import { apiErrorMessage } from './api-error';

describe('apiErrorMessage', () => {
  it('uses the error text sent by the API', () => {
    const err = new HttpErrorResponse({ status: 404, error: { error: 'Category not found' } });
    expect(apiErrorMessage(err)).toBe('Category not found');
  });

  it('uses the message field when there is no error text', () => {
    const err = new HttpErrorResponse({ status: 409, error: { message: 'Mail Exists' } });
    expect(apiErrorMessage(err)).toBe('Mail Exists');
  });

  it('explains when the server cannot be reached', () => {
    const err = new HttpErrorResponse({ status: 0 });
    expect(apiErrorMessage(err)).toContain('Cannot reach the server');
  });

  it('falls back for anything else', () => {
    expect(apiErrorMessage(new Error('boom'), 'Fallback')).toBe('Fallback');
    expect(apiErrorMessage(new HttpErrorResponse({ status: 500, error: 'oops' }), 'Fallback')).toBe('Fallback');
  });
});
