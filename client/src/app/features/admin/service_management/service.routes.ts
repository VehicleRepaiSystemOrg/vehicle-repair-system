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
    path: 'add',
    loadComponent: () => import('./pages/add-service/add-service.component').then(c => c.AddServiceComponent)
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./pages/edit-service/edit-service.component').then(c => c.EditServiceComponent)
  }
];

