import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from '../../environments/environment';
import { PeriodService } from '../core/period.service';
import { MonthPickerComponent } from '../shared/month-picker/month-picker.component';

import { ExpencesComponent } from './expences.component';

describe('ExpencesComponent', () => {
  let component: ExpencesComponent;
  let fixture: ComponentFixture<ExpencesComponent>;
  let http: HttpTestingController;

  const food = { _id: 'c1', name: 'Food', description: 'Groceries' };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, ReactiveFormsModule],
      declarations: [ ExpencesComponent, MonthPickerComponent ]
    })
    .compileComponents();

    TestBed.inject(PeriodService).setFromInput('2026-03');
    fixture = TestBed.createComponent(ExpencesComponent);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => http.verify());

  function flushInitialRequests(): void {
    const list = http.expectOne((req) => req.url === `${environment.apiUrl}/expense/monthly_expenses`);
    expect(list.request.params.get('month')).toBe('3');
    expect(list.request.params.get('year')).toBe('2026');
    list.flush({
      month: 3,
      year: 2026,
      totalExpenses: 170,
      expenses: [
        { _id: 'e1', amount: 50, date: '2026-03-02T00:00:00.000Z', description: 'Bread', category: food },
        { _id: 'e2', amount: 120, date: '2026-03-20T00:00:00.000Z', description: 'Market', category: food },
      ],
    });
    http.expectOne(`${environment.apiUrl}/category`).flush({ categories: [food] });
    fixture.detectChanges();
  }

  it('should create', () => {
    flushInitialRequests();
    expect(component).toBeTruthy();
  });

  it('lists the chosen month, newest expense first', () => {
    flushInitialRequests();
    const rows = (fixture.nativeElement as HTMLElement).querySelectorAll('tbody tr');
    expect(rows.length).toBe(2);
    expect(rows[0].textContent).toContain('Market');
    expect(component.total).toBe(170);
  });

  it('creates an expense with the category name and reloads the list', () => {
    flushInitialRequests();
    component.startAdd();
    component.form.setValue({ amount: 30, category: 'Food', date: '2026-03-05', description: ' Lunch ' });
    component.save();

    const create = http.expectOne(`${environment.apiUrl}/expense/create`);
    expect(create.request.body).toEqual({ amount: 30, category: 'Food', date: '2026-03-05', description: 'Lunch' });
    create.flush({ expense: { _id: 'e3', amount: 30, date: '2026-03-05T00:00:00.000Z', category: food } });

    http.expectOne((req) => req.url === `${environment.apiUrl}/expense/monthly_expenses`)
      .flush({ month: 3, year: 2026, totalExpenses: 200, expenses: [] });
    expect(component.formOpen).toBeFalse();
    expect(component.total).toBe(200);
  });

  it('prefills the form when editing', () => {
    flushInitialRequests();
    component.startEdit(component.expenses[0]);
    expect(component.form.getRawValue()).toEqual({
      amount: 120,
      category: 'Food',
      date: '2026-03-20',
      description: 'Market',
    });
  });
});
