import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { apiErrorMessage } from '../../../core/api-error';
import { AuthService } from '../../../core/auth.service';

type Field = 'firstname' | 'lastname' | 'username' | 'email' | 'password' | 'confirm';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.sass']
})
export class RegisterComponent {
  readonly form = this.fb.nonNullable.group({
    firstname: ['', Validators.required],
    lastname: ['', Validators.required],
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirm: ['', Validators.required],
  });
  submitting = false;
  error = '';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  get passwordsDiffer(): boolean {
    const { password, confirm } = this.form.controls;
    return confirm.touched && confirm.value !== '' && password.value !== confirm.value;
  }

  showError(field: Field): boolean {
    const c = this.form.controls[field];
    return c.invalid && (c.touched || c.dirty);
  }

  submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.passwordsDiffer) {
      return;
    }
    const { confirm, ...input } = this.form.getRawValue();
    this.submitting = true;
    this.error = '';
    this.auth.register(input).subscribe({
      next: () => this.router.navigate(['/login'], { queryParams: { registered: 1 } }),
      error: (err: unknown) => {
        this.submitting = false;
        this.error = apiErrorMessage(err, 'Could not create the account.');
      },
    });
  }
}
