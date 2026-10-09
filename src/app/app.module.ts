import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CategoriesComponent } from './categories/categories.component';
import { AuthInterceptor } from './core/auth.interceptor';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ExpencesComponent } from './expences/expences.component';
import { LayoutComponent } from './layout/layout.component';
import { UsersComponent } from './users/users.component';
import { MainHeaderComponent } from './shared/main-header/main-header.component';
import { MainSidebarComponent } from './shared/main-sidebar/main-sidebar.component';
import { ContentWrapperComponent } from './shared/content-wrapper/content-wrapper.component';
import { MainFooterComponent } from './shared/main-footer/main-footer.component';
import { MonthPickerComponent } from './shared/month-picker/month-picker.component';
import { LoginComponent } from './modules/auth/login/login.component';
import { RegisterComponent } from './modules/auth/register/register.component';
import { AuthComponent } from './modules/auth/auth.component';

@NgModule({
  declarations: [
    AppComponent,
    ExpencesComponent,
    UsersComponent,
    MainHeaderComponent,
    MainSidebarComponent,
    ContentWrapperComponent,
    MainFooterComponent,
    LoginComponent,
    RegisterComponent,
    AuthComponent,
    LayoutComponent,
    DashboardComponent,
    CategoriesComponent,
    MonthPickerComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
