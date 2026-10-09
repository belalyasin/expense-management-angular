import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, catchError, forkJoin, of, switchMap, tap } from 'rxjs';
import { apiErrorMessage } from '../core/api-error';
import { ExpenseService } from '../core/expense.service';
import { MonthlyStatistics } from '../core/models';
import { PeriodService } from '../core/period.service';

interface CategoryRow {
  name: string;
  amount: number;
  /** Percentage of the month's total. */
  share: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, OnDestroy {
  stats: MonthlyStatistics | null = null;
  breakdown: CategoryRow[] = [];
  income = 0;
  loading = true;
  error = '';

  private readonly subscription = new Subscription();

  constructor(private expenses: ExpenseService, private period: PeriodService) {}

  ngOnInit(): void {
    this.subscription.add(
      this.period.period$
        .pipe(
          tap(() => {
            this.loading = true;
            this.error = '';
          }),
          switchMap((period) =>
            forkJoin([this.expenses.statistics(period), this.expenses.byCategory(period)]).pipe(
              catchError((err: unknown) => {
                this.error = apiErrorMessage(err, 'Could not load the statistics.');
                return of(null);
              })
            )
          )
        )
        .subscribe((result) => {
          this.loading = false;
          if (!result) {
            this.stats = null;
            this.breakdown = [];
            return;
          }
          const [stats, byCategory] = result;
          this.stats = stats;
          this.income = stats.totalExpenses + stats.remainingIncome;
          this.breakdown = Object.entries(byCategory.categoryStatistics)
            .map(([name, amount]) => ({
              name,
              amount,
              share: stats.totalExpenses > 0 ? (amount / stats.totalExpenses) * 100 : 0,
            }))
            .sort((a, b) => b.amount - a.amount);
        })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
