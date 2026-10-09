const APP_LAYOUT = 'hold-transition dark-mode sidebar-mini layout-fixed layout-navbar-fixed layout-footer-fixed';
const AUTH_LAYOUT = 'hold-transition dark-mode login-page';

/** AdminLTE styles the page through classes on <body>; the login pages and the app need different ones. */
export function setBodyLayout(doc: Document, layout: 'app' | 'auth'): void {
  doc.body.className = layout === 'app' ? APP_LAYOUT : AUTH_LAYOUT;
}
