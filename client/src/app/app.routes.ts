import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  
  // 1. Auth routes (Login/Register) - No Sidebar here
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },

  // 2. Dashboard routes - Sidebar + Header ALWAYS show here
  {
    path: '',
    component: MainLayoutComponent, // The parent wrapper
    children: [
      { path: 'dashboard', loadComponent: () => import('./features/dashboard/pages/user-dashboard.stub').then(m => m.UserDashboardStubComponent) },
      { path: 'admin/dashboard', loadComponent: () => import('./features/dashboard/pages/admin-dashboard.stub').then(m => m.AdminDashboardStubComponent) },
      
      // ADD THE OTHER FEATURES HERE:
      { path: 'reports', loadChildren: () => import('./features/repairs/repaires.routes').then(m => m.REPAIRS_ROUTES) },
      { path: 'staff', loadChildren: () => import('./features/staff/staff.routes').then(m => m.STAFF_ROUTES) },
      { path: 'inventory', loadChildren: () => import('./features/inventory/inventory.routes').then(m => m.INVENTORY_ROUTES) },
      // { path: 'settings', ... }
    ]
  },

  { path: '**', redirectTo: 'login' }
];