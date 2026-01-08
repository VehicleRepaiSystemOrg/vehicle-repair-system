import { Routes } from '@angular/router';

/**
 * Service Management Routes
 * Handles routing for service management feature
 */
export const SERVICE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/service-management.component').then(c => c.ServiceManagementComponent)
  },
  {
    path: 'requests',
    loadComponent: () => import('./pages/appointment-requests/appointment-requests.component').then(c => c.AppointmentRequestsComponent)
  },
  {
    path: 'add',
    loadComponent: () => import('./pages/add-service/add-service.component').then(c => c.AddServiceComponent)
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./pages/edit-service/edit-service.component').then(c => c.EditServiceComponent)
  },
  {
    path: 'create-invoice/:id',
    loadComponent: () => import('./pages/create-invoice/create-invoice.component').then(c => c.CreateInvoiceComponent)
  },
  {
    path: 'view-invoice/:id',
    loadComponent: () => import('./pages/view-invoice/view-invoice.component').then(c => c.ViewInvoiceComponent)
  }
];

