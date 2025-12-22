import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },

  {
    path: '',
    component: MainLayoutComponent, 
    children: [
      { 
        path: 'dashboard', 
        loadComponent: () => import('./features/dashboard/pages/user-dashboard.stub').then(m => m.UserDashboardStubComponent) 
      },
      { 
        path: 'admin/dashboard', 
        loadComponent: () => import('./features/dashboard/pages/admin-dashboard.stub').then(m => m.AdminDashboardStubComponent) 
      },
      { 
        path: 'reports', 
        // Note: Changed from REPAIRS_ROUTES to repairesRoutes to match your previous snippet
        loadChildren: () => import('./features/repairs/repaires.routes').then(m => m.repairesRoutes) 
      },
      { 
        path: 'staff', 
        // Ensure this file exists and the export is named staffRoutes
        loadChildren: () => import('./features/staff/staff.routes').then(m => m.staffRoutes) 
      },
      { 
        path: 'inventory', 
        // Ensure this file exists and the export is named inventoryRoutes
        loadChildren: () => import('./features/inventory/inventory.routes').then(m => m.inventoryRoutes) 
      },
      {
        path: 'customers',
        loadChildren: () => import('./features/customer/customer.routes').then(m => m.CUSTOMER_ROUTES),
      }
    ]
  },

  { path: '**', redirectTo: 'auth/login' },
];