import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface CustomerKpis {
  activeRepairs: number;
  nextServiceDays: number;
  activeWarranties: number;
  completedJobs: number;
}

export interface RecentUpdateItem {
  title: string;
  timeLabel: string;
  icon: 'wrench' | 'search' | 'truck';
}

export interface ActiveWarrantyRow {
  purchaseDate: string;
  expirationDate: string;
  coveredItems: string;
  provider: string;
  status: 'Active' | 'Expired';
}

export interface UpcomingServiceRow {
  vehicle: string;
  serviceType: string;
  recommendedDate: string;
  recommendedMileage: string;
}

export interface PastRepairRow {
  date: string;
  vehicle: string;
  service: string;
  status: 'Completed' | 'In Progress';
  invoiceLabel: string;
}

@Injectable({ providedIn: 'root' })
export class CustomerDashboardFacade {
  // TODO (backend): Inject HttpClient and base API URL
  // constructor(private http: HttpClient) {}

  // TODO (backend): Replace with API call
  // GET /customer/dashboard/kpis - Fetch dashboard KPIs
  // Expected response: { activeRepairs, nextServiceDays, activeWarranties, completedJobs }
  getKpis(): Observable<CustomerKpis> {
    return of({
      activeRepairs: 2,
      nextServiceDays: 18,
      activeWarranties: 3,
      completedJobs: 12,
    });
  }

  // TODO (backend): Replace with API call
  // GET /customer/dashboard/recent-updates - Fetch recent activity updates
  // Expected response: Array of { title, timeLabel, icon, type }
  getRecentUpdates(): Observable<RecentUpdateItem[]> {
    return of([
      { title: 'Brake pads replaced', timeLabel: 'Today, 10:30 AM', icon: 'wrench' },
      { title: 'Diagnostics completed', timeLabel: 'Yesterday, 4:15 PM', icon: 'search' },
      { title: 'Parts arrived at shop', timeLabel: 'Yesterday, 9:00 AM', icon: 'truck' },
    ]);
  }

  // TODO (backend): Replace with API call
  // GET /customer/warranties?status=active - Fetch active warranties
  // Expected response: Array of warranty objects
  getActiveWarranties(): Observable<ActiveWarrantyRow[]> {
    return of([
      { purchaseDate: '03/15/2023', expirationDate: '03/15/2024', coveredItems: 'Engine Components', provider: 'AutoFix Warranty', status: 'Active' },
      { purchaseDate: '06/20/2023', expirationDate: '06/20/2025', coveredItems: 'Transmission System', provider: 'Extended Warranty Co.', status: 'Active' },
      { purchaseDate: '09/05/2023', expirationDate: '09/05/2024', coveredItems: 'Brake System', provider: 'AutoFix Warranty', status: 'Active' },
    ]);
  }

  // TODO (backend): Replace with API call
  // GET /customer/warranties?status=expired - Fetch expired warranties
  // Expected response: Array of warranty objects
  getExpiredWarranties(): Observable<ActiveWarrantyRow[]> {
    return of([
      { purchaseDate: '12/10/2022', expirationDate: '12/10/2023', coveredItems: 'Suspension System', provider: 'AutoFix Warranty', status: 'Expired' },
      { purchaseDate: '01/25/2022', expirationDate: '01/25/2023', coveredItems: 'Electrical System', provider: 'Extended Warranty Co.', status: 'Expired' },
    ]);
  }

  // TODO (backend): Replace with API call
  // GET /customer/service-reminders?status=upcoming - Fetch upcoming service reminders
  // Expected response: Array of service reminder objects
  getUpcomingServices(): Observable<UpcomingServiceRow[]> {
    return of([
      { vehicle: '2021 Sedan', serviceType: 'Oil Change', recommendedDate: '2024-08-15', recommendedMileage: '10,000 miles' },
      { vehicle: '2019 SUV', serviceType: 'Tire Rotation', recommendedDate: '2024-09-20', recommendedMileage: '20,000 miles' },
      { vehicle: '2022 Truck', serviceType: 'Brake Inspection', recommendedDate: '2024-10-05', recommendedMileage: '30,000 miles' },
    ]);
  }

  // TODO (backend): Replace with API call
  // GET /customer/repairs?status=completed - Fetch completed repairs
  // Expected response: Array of repair objects with invoice links
  getPastRepairs(): Observable<PastRepairRow[]> {
    return of([
      { date: '03/15/2023', vehicle: '2018 Sedan', service: 'Brake Repair', status: 'Completed', invoiceLabel: 'View' },
      { date: '02/20/2023', vehicle: '2020 SUV', service: 'Oil Change', status: 'Completed', invoiceLabel: 'View' },
      { date: '01/10/2023', vehicle: '2018 Sedan', service: 'Tire Rotation', status: 'Completed', invoiceLabel: 'View' },
    ]);
  }
}
