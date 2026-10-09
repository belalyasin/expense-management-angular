import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from '../../../../environments/environment';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, ReactiveFormsModule],
      declarations: [ LoginComponent ]
    })
    .compileComponents();

    localStorage.clear();
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    http.verify();
    localStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('does not call the API while the form is invalid', () => {
    component.submit();
    http.expectNone(`${environment.apiUrl}/user/login`);
    expect(component.showError('email')).toBeTrue();
    expect(component.showError('password')).toBeTrue();
  });

  it('logs in, stores the token and opens the dashboard', () => {
    const navigate = spyOn(TestBed.inject(Router), 'navigate').and.resolveTo(true);
    component.form.setValue({ email: 'user@example.com', password: 'password123' });
    component.submit();

    const request = http.expectOne(`${environment.apiUrl}/user/login`);
    expect(request.request.body).toEqual({ email: 'user@example.com', password: 'password123' });
    request.flush({ message: 'Login successful', token: 'abc' });

    expect(localStorage.getItem('expense_management_token')).toBe('abc');
    expect(navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('shows the message returned by the API when login fails', () => {
    component.form.setValue({ email: 'user@example.com', password: 'wrong' });
    component.submit();
    http.expectOne(`${environment.apiUrl}/user/login`)
      .flush({ error: 'Invalid credentials' }, { status: 401, statusText: 'Unauthorized' });

    expect(component.error).toBe('Invalid credentials');
    expect(component.submitting).toBeFalse();
  });
});
