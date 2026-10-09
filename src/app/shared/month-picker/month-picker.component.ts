import { Component } from '@angular/core';
import { PeriodService } from '../../core/period.service';

@Component({
  selector: 'app-month-picker',
  template: `
    <label class="sr-only" for="month-picker">Month</label>
    <input
      id="month-picker"
      type="month"
      class="form-control"
      [value]="period.inputValue"
      (change)="onChange($event)"
    />
  `,
})
export class MonthPickerComponent {
  constructor(public period: PeriodService) {}

  onChange(event: Event): void {
    this.period.setFromInput((event.target as HTMLInputElement).value);
  }
}
