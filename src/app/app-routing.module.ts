import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriesComponent } from './categories/categories.component';
import { AuthGuard, GuestGuard } from './core/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ExpencesComponent } from './expences/expences.component';
import { LayoutComponent } from './layout/layout.component';
import { AuthComponent } from './modules/auth/auth.component';
import { LoginComponent } from './modules/auth/login/login.component';
import { RegisterComponent } from './modules/auth/register/register.component';
import { UsersComponent } from './users/users.component';

const routes: Routes = [
  {
    path: 'login',
    component: AuthComponent,
    canActivate: [GuestGuard],
    children: [{ path: '', component: LoginComponent, title: 'Sign in | Expense Manager' }],
  },
  {
    path: 'register',
    component: AuthComponent,
    canActivate: [GuestGuard],
    children: [{ path: '', component: RegisterComponent, title: 'Register | Expense Manager' }],
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', component: DashboardComponent, title: 'Dashboard | Expense Manager' },
      { path: 'expenses', component: ExpencesComponent, title: 'Expenses | Expense Manager' },
      { path: 'categories', component: CategoriesComponent, title: 'Categories | Expense Manager' },
      { path: 'profile', component: UsersComponent, title: 'Profile | Expense Manager' },
    ],
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
