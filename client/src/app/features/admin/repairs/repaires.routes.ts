import { Routes } from '@angular/router';
import { ReportPageComponent } from './pages/report-page.component';

export const repairesRoutes: Routes = [
  { 
    path: '', // This makes the URL: /reports
    component: ReportPageComponent 
  },
  { 
    path: 'invoice-report', // This makes the URL: /reports/invoice-report
    component: ReportPageComponent 
  }
];