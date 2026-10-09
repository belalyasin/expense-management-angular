import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { apiErrorMessage } from '../core/api-error';
import { AuthService } from '../core/auth.service';
import { User } from '../core/models';

/** Profile page: account details and the monthly income setting. */
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.sass']
})
export class UsersComponent implements OnInit, OnDestroy {
  user: User | null = null;
  saving = false;
  saved = false;
  error = '';
  readonly form = this.fb.nonNullable.group({
    monthlyIncome: [null as number | null, [Validators.required, Validators.min(0)]],
  });

  private readonly subscription = new Subscription();

  constructor(private fb: FormBuilder, private auth: AuthService) {}

  ngOnInit(): void {
    this.subscription.add(
      this.auth.user$.subscribe((user) => {
        const firstLoad = this.user === null && user !== null;
        this.user = user;
        if (user && firstLoad) {
          this.form.reset({ monthlyIncome: user.monthlyIncome });
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving = true;
    this.saved = false;
    this.error = '';
    this.auth.setMonthlyIncome(Number(this.form.getRawValue().monthlyIncome)).subscribe({
      next: () => {
        this.saving = false;
        this.saved = true;
      },
      error: (err: unknown) => {
        this.saving = false;
        this.error = apiErrorMessage(err, 'Could not save the monthly income.');
      },
    });
  }
}
