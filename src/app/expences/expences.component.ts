import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Subscription, catchError, of, switchMap, tap } from 'rxjs';
import { apiErrorMessage } from '../core/api-error';
import { CategoryService } from '../core/category.service';
import { ExpenseService } from '../core/expense.service';
import { Category, Expense, ExpenseInput } from '../core/models';
import { PeriodService } from '../core/period.service';

type Field = 'amount' | 'category' | 'date';

@Component({
  selector: 'app-expences',
  templateUrl: './expences.component.html',
  styleUrls: ['./expences.component.sass']
})
export class ExpencesComponent implements OnInit, OnDestroy {
  expenses: Expense[] = [];
  total = 0;
  categories: Category[] = [];
  categoriesLoaded = false;
  loading = true;
  error = '';

  formOpen = false;
  editing: Expense | null = null;
  saving = false;
  formError = '';
  readonly form = this.fb.nonNullable.group({
    amount: [null as number | null, [Validators.required, Validators.min(0.01)]],
    category: ['', Validators.required],
    date: ['', Validators.required],
    description: [''],
  });

  confirmingDeleteId: string | null = null;
  deletingId: string | null = null;

  private readonly subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private expenseService: ExpenseService,
    private categoryService: CategoryService,
    private period: PeriodService
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.period.period$
        .pipe(
          tap(() => {
            this.loading = true;
            this.error = '';
            this.confirmingDeleteId = null;
          }),
          switchMap((period) =>
            this.expenseService.list(period).pipe(
              catchError((err: unknown) => {
                this.error = apiErrorMessage(err, 'Could not load the expenses.');
                return of(null);
              })
            )
          )
        )
        .subscribe((result) => {
          this.loading = false;
          this.expenses = result ? this.sorted(result.expenses) : [];
          this.total = result ? result.totalExpenses : 0;
        })
    );
    this.categoryService.list().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.categoriesLoaded = true;
      },
      error: () => (this.categoriesLoaded = true),
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  showError(field: Field): boolean {
    const c = this.form.controls[field];
    return c.invalid && (c.touched || c.dirty);
  }

  startAdd(): void {
    this.editing = null;
    this.formError = '';
    this.form.reset({ amount: null, category: '', date: this.defaultDate(), description: '' });
    this.formOpen = true;
  }

  startEdit(expense: Expense): void {
    this.editing = expense;
    this.formError = '';
    this.confirmingDeleteId = null;
    this.form.reset({
      amount: expense.amount,
      category: expense.category?.name ?? '',
      date: expense.date.slice(0, 10),
      description: expense.description ?? '',
    });
    this.formOpen = true;
  }

  closeForm(): void {
    this.formOpen = false;
    this.editing = null;
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    const input: ExpenseInput = {
      amount: Number(value.amount),
      category: value.category,
      date: value.date,
      description: value.description.trim(),
    };
    this.saving = true;
    this.formError = '';
    const request = this.editing
      ? this.expenseService.update(this.editing._id, input)
      : this.expenseService.create(input);
    request.subscribe({
      next: () => {
        this.saving = false;
        this.closeForm();
        this.reload();
      },
      error: (err: unknown) => {
        this.saving = false;
        this.formError = apiErrorMessage(err, 'Could not save the expense.');
      },
    });
  }

  remove(expense: Expense): void {
    this.deletingId = expense._id;
    this.expenseService.remove(expense._id).subscribe({
      next: () => {
        this.deletingId = null;
        this.confirmingDeleteId = null;
        if (this.editing?._id === expense._id) {
          this.closeForm();
        }
        this.reload();
      },
      error: (err: unknown) => {
        this.deletingId = null;
        this.error = apiErrorMessage(err, 'Could not delete the expense.');
      },
    });
  }

  private reload(): void {
    this.expenseService.list(this.period.period).subscribe({
      next: (result) => {
        this.expenses = this.sorted(result.expenses);
        this.total = result.totalExpenses;
        this.error = '';
      },
      error: (err: unknown) => (this.error = apiErrorMessage(err, 'Could not load the expenses.')),
    });
  }

  private sorted(expenses: Expense[]): Expense[] {
    return [...expenses].sort((a, b) => b.date.localeCompare(a.date));
  }

  /** Today when the current month is shown, otherwise the first day of the month on screen. */
  private defaultDate(): string {
    const { month, year } = this.period.period;
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    if (now.getMonth() + 1 === month && now.getFullYear() === year) {
      return `${year}-${pad(month)}-${pad(now.getDate())}`;
    }
    return `${year}-${pad(month)}-01`;
  }
}
