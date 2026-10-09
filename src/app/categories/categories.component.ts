import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { apiErrorMessage } from '../core/api-error';
import { CategoryService } from '../core/category.service';
import { Category } from '../core/models';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  loading = true;
  error = '';

  formOpen = false;
  editing: Category | null = null;
  saving = false;
  formError = '';
  readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
  });

  confirmingDeleteId: string | null = null;
  deletingId: string | null = null;

  constructor(private fb: FormBuilder, private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.load();
  }

  showError(field: 'name' | 'description'): boolean {
    const c = this.form.controls[field];
    return c.invalid && (c.touched || c.dirty);
  }

  startAdd(): void {
    this.editing = null;
    this.formError = '';
    this.form.reset({ name: '', description: '' });
    this.formOpen = true;
  }

  startEdit(category: Category): void {
    this.editing = category;
    this.formError = '';
    this.confirmingDeleteId = null;
    this.form.reset({ name: category.name, description: category.description });
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
    const name = value.name.trim();
    const description = value.description.trim();
    this.saving = true;
    this.formError = '';
    const request = this.editing
      ? this.categoryService.update(this.editing._id, name, description)
      : this.categoryService.create(name, description);
    request.subscribe({
      next: () => {
        this.saving = false;
        this.closeForm();
        this.load();
      },
      error: (err: unknown) => {
        this.saving = false;
        this.formError = apiErrorMessage(err, 'Could not save the category.');
      },
    });
  }

  remove(category: Category): void {
    this.deletingId = category._id;
    this.error = '';
    this.categoryService.remove(category._id).subscribe({
      next: () => {
        this.deletingId = null;
        this.confirmingDeleteId = null;
        if (this.editing?._id === category._id) {
          this.closeForm();
        }
        this.load();
      },
      error: (err: unknown) => {
        this.deletingId = null;
        this.confirmingDeleteId = null;
        this.error =
          err instanceof HttpErrorResponse && err.status === 409
            ? `"${category.name}" still has expenses. Move or delete them first.`
            : apiErrorMessage(err, 'Could not delete the category.');
      },
    });
  }

  private load(): void {
    this.categoryService.list().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.loading = false;
      },
      error: (err: unknown) => {
        this.loading = false;
        this.error = apiErrorMessage(err, 'Could not load the categories.');
      },
    });
  }
}
