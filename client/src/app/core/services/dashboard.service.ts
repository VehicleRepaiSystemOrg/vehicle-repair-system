import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface Stats {
  pendingRequests: number;
  activeRepairs: number;
  revenueToday: number;
  employeeAvailability: string;
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly http = inject(HttpClient);

  // TODO: Fetch these counts from the /api/stats endpoint in the backend
  getStats(): Observable<Stats> {
    return this.http.get<Stats>('/api/stats');
  }
}
