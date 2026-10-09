import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Period } from './models';

/** The month the dashboard and the expense list are showing. Shared so both pages stay in step. */
@Injectable({ providedIn: 'root' })
export class PeriodService {
  private readonly subject = new BehaviorSubject<Period>(PeriodService.currentMonth());
  readonly period$ = this.subject.asObservable();

  get period(): Period {
    return this.subject.value;
  }

  /** Value for an <input type="month">, e.g. "2026-03". */
  get inputValue(): string {
    const { month, year } = this.period;
    return `${year}-${String(month).padStart(2, '0')}`;
  }

  /** Accepts the value of an <input type="month">. Ignores an empty or malformed value. */
  setFromInput(value: string): void {
    const match = /^(\d{4})-(\d{2})$/.exec(value);
    if (!match) {
      return;
    }
    const year = Number(match[1]);
    const month = Number(match[2]);
    if (month >= 1 && month <= 12) {
      this.subject.next({ month, year });
    }
  }

  static currentMonth(): Period {
    const now = new Date();
    return { month: now.getMonth() + 1, year: now.getFullYear() };
  }
}
