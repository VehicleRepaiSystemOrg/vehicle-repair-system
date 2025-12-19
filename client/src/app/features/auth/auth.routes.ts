import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/customer-login/customer-login.page').then(
        (m) => m.CustomerLoginPageComponent
      ),
  },
  {
    path: 'login/otp',
    loadComponent: () =>
      import('./pages/customer-otp/customer-otp.page').then((m) => m.CustomerOtpPageComponent),
  },
  {
    path: 'admin/login',
    loadComponent: () =>
      import('./pages/admin-login/admin-login.page').then((m) => m.AdminLoginPageComponent),
  },
];
