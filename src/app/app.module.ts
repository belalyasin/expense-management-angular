import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ExpencesComponent } from './expences/expences.component';
import { UsersComponent } from './users/users.component';
import { MainHeaderComponent } from './shared/main-header/main-header.component';
import { MainSidebarComponent } from './shared/main-sidebar/main-sidebar.component';
import { ContentWrapperComponent } from './shared/content-wrapper/content-wrapper.component';
import { MainFooterComponent } from './shared/main-footer/main-footer.component';
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
    AuthComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
