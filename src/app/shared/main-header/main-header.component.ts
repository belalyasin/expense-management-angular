import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.sass']
})
export class MainHeaderComponent {
  loggingOut = false;

  constructor(public auth: AuthService, private router: Router) {}

  logout(): void {
    this.loggingOut = true;
    // The local session ends whether or not the server could be reached.
    const done = () => {
      this.loggingOut = false;
      this.router.navigate(['/login']);
    };
    this.auth.logout().subscribe({ next: done, error: done });
  }
}
