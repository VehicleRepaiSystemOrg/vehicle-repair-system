import { Routes } from '@angular/router';

export const CUSTOMER_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/customer-shell.component').then(m => m.CustomerShellComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'overview' },

      {
        path: 'overview',
        loadComponent: () =>
          import('./pages/overview/customer-overview.page').then(m => m.CustomerOverviewPageComponent),
      },
      {
        path: 'my-repairs',
        loadComponent: () =>
          import('./pages/my-repairs/customer-my-repairs.page').then(m => m.CustomerMyRepairsPageComponent),
      },
      {
        path: 'warranty',
        loadComponent: () =>
          import('./pages/warranty/customer-warranty.page').then(m => m.CustomerWarrantyPageComponent),
      },
      {
        path: 'service-reminder',
        loadComponent: () =>
          import('./pages/service-reminder/customer-service-reminder.page').then(m => m.CustomerServiceReminderPageComponent),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./pages/settings/customer-settings.page').then(m => m.CustomerSettingsPageComponent),
      },
      {
        path: 'book-service',
        loadComponent: () =>
          import('./pages/book-service/customer-book-service.page').then(m => m.CustomerBookServicePageComponent),
      },
      {
        path: 'booking-confirmation',
        loadComponent: () =>
          import('./pages/booking-confirmation/customer-booking-confirmation.page').then(
            m => m.CustomerBookingConfirmationPageComponent,
          ),
      },
      {
        path: 'service-history',
        loadComponent: () =>
          import('./pages/service-history/customer-service-history.page').then(
            m => m.CustomerServiceHistoryPageComponent,
          ),
      },
      {
        path: 'invoice-overview',
        loadComponent: () =>
          import('./pages/invoice-overview/customer-invoice-overview.page').then(
            m => m.CustomerInvoiceOverviewPageComponent,
          ),
      },
      {
        path: 'notifications',
        loadComponent: () =>
          import('./pages/notifications/customer-notifications.page').then(
            m => m.CustomerNotificationsPageComponent,
          ),
      },
    ],
  },
];
