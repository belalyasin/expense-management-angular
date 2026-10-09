import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { AuthService } from '../core/auth.service';
import { setBodyLayout } from '../core/body-class';

/** Shell of the signed-in area: header, sidebar, page content and footer. */
@Component({
  selector: 'app-layout',
  template: `
    <div class="wrapper">
      <app-main-header></app-main-header>
      <app-main-sidebar></app-main-sidebar>
      <app-content-wrapper></app-content-wrapper>
      <app-main-footer></app-main-footer>
    </div>
  `,
})
export class LayoutComponent implements OnInit, AfterViewInit {
  constructor(@Inject(DOCUMENT) private document: Document, private auth: AuthService) {}

  ngOnInit(): void {
    setBodyLayout(this.document, 'app');
    // A failed request is handled by the interceptor (expired token) or simply leaves the name blank.
    this.auth.loadProfile().subscribe({ error: () => undefined });
  }

  ngAfterViewInit(): void {
    // AdminLTE sizes the layout on window load, before Angular has rendered it.
    this.document.defaultView?.dispatchEvent(new Event('resize'));
  }
}
