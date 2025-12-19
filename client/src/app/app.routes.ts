import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },

  {
    path: '',
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },

  // TODO: Replace with your real dashboard routes/components
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/pages/user-dashboard.stub').then(
        (m) => m.UserDashboardStubComponent
      ),
  },
  {
    path: 'admin/dashboard',
    loadComponent: () =>
      import('./features/dashboard/pages/admin-dashboard.stub').then(
        (m) => m.AdminDashboardStubComponent
      ),
  },

  { path: '**', redirectTo: 'login' },
];
