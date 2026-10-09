import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';

@Component({
  selector: 'app-main-sidebar',
  templateUrl: './main-sidebar.component.html',
  styleUrls: ['./main-sidebar.component.sass']
})
export class MainSidebarComponent {
  readonly items = [
    { label: 'Dashboard', link: '/dashboard', icon: 'fas fa-tachometer-alt' },
    { label: 'Expenses', link: '/expenses', icon: 'fas fa-receipt' },
    { label: 'Categories', link: '/categories', icon: 'fas fa-tags' },
    { label: 'Profile', link: '/profile', icon: 'fas fa-user' },
  ];

  constructor(@Inject(DOCUMENT) private document: Document) {}

  /** On small screens the sidebar covers the page, so close it once a link is chosen. */
  closeOnMobile(): void {
    const body = this.document.body;
    if (body.classList.contains('sidebar-open')) {
      body.classList.remove('sidebar-open');
      body.classList.add('sidebar-closed', 'sidebar-collapse');
    }
  }
}
