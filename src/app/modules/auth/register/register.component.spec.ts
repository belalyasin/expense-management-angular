import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from '../../../../environments/environment';

import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let http: HttpTestingController;

  const valid = {
    firstname: 'Sami',
    lastname: 'Tester',
    username: 'sami',
    email: 'sami@example.com',
    password: 'password123',
    confirm: 'password123',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, ReactiveFormsModule],
      declarations: [ RegisterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => http.verify());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('does not register when the passwords differ', () => {
    component.form.setValue({ ...valid, confirm: 'something-else' });
    component.submit();
    http.expectNone(`${environment.apiUrl}/user/register`);
    expect(component.passwordsDiffer).toBeTrue();
  });

  it('sends the account details without the confirmation field, then opens the login page', () => {
    const navigate = spyOn(TestBed.inject(Router), 'navigate').and.resolveTo(true);
    component.form.setValue(valid);
    component.submit();
    const request = http.expectOne(`${environment.apiUrl}/user/register`);
    const { confirm, ...expected } = valid;
    expect(request.request.body).toEqual(expected);
    request.flush({ message: 'User is created successfully' }, { status: 201, statusText: 'Created' });
    expect(navigate).toHaveBeenCalledWith(['/login'], { queryParams: { registered: 1 } });
  });
});
