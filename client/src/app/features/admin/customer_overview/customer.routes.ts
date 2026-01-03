import { Routes } from '@angular/router';

export const CUSTOMER_OVERVIEW_ROUTES: Routes = [
  { 
    path: '', 
    loadComponent: () => import('./pages/overview/overview.component').then(c => c.OverviewComponent) 
  },
  { 
    path: 'add', 
    loadComponent: () => import('./pages/add-customer/add-customer.component').then(c => c.AddCustomerComponent) 
  },
  { 
    path: 'edit/:id', 
    loadComponent: () => import('./pages/edit-customer/edit-customer.component').then(c => c.EditCustomerComponent) 
  },
  { 
    path: 'status/:id', 
    loadComponent: () => import('./pages/update-status/update-status.component').then(c => c.UpdateStatusComponent) 
  },
  { 
    path: 'invoice/:id', 
    loadComponent: () => import('./pages/invoice-details/invoice-details.component').then(c => c.InvoiceDetailsComponent) 
  }
];