import { Routes } from '@angular/router';
import { MainLayoutComponent } from './features/admin/layout/main-layout/main-layout.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', loadComponent: () => import('./features/admin/homepage/homepage.component').then(m => m.HomepageComponent) },

  {
    path: '',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },

  {
    path: 'dashboard',
    loadChildren: () => import('./features/customer/customer.routes').then(m => m.CUSTOMER_ROUTES)
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'admin',
        children: [
          {
            path: 'dashboard',
            loadComponent: () => import('./features/admin/dashboard/pages/admin-dashboard.stub').then(m => m.AdminDashboardStubComponent)
          },
        ]
      },

      {
        path: 'reports',
        loadChildren: () => import('./features/admin/repairs/repaires.routes').then(m => m.repairesRoutes)
      },
      // FIXED: Single entry for staff routes
      {
        path: 'staff',
        loadChildren: () => import('./features/admin/staff/staff.routes').then(m => m.staffRoutes)
      },
      // FIXED: Single entry for inventory routes
      {
        path: 'inventory',
        loadChildren: () => import('./features/admin/inventory/inventory.routes').then(m => m.inventoryRoutes)
      },
      {
        path: 'settings',
        loadComponent: () => import('./features/admin/settings/admin-settings.page').then(m => m.AdminSettingsPage)
      },
      {
        path: 'customers',
        loadChildren: () => import('./features/customer/customer.routes').then(m => m.CUSTOMER_ROUTES),
      },
      {
        path: 'notifications',
        loadChildren: () => import('./features/admin/notifications/notifications.routes').then(m => m.NOTIFICATION_ROUTES)
      },
      // In src/app/app.routes.ts
      {
        path: 'customer_overview',
        loadChildren: () => import('./features/admin/customer_overview/customer.routes').then(m => m.CUSTOMER_OVERVIEW_ROUTES)
      },
      {
        path: 'service_management',
        loadChildren: () => import('./features/admin/service_management/service.routes').then(m => m.SERVICE_ROUTES)
      }
    ]
  },
  { path: '**', redirectTo: 'login' },
];
