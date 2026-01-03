import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface Appointment {
  id?: string;
  customer: string;
  vehicle: string;
  service: string;
  date: string;
  time: string;
  status: string;
}

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private readonly http = inject(HttpClient);

  // TODO: Replace base URL with environment variable or central ApiService
  private base = '/api/appointments';

  getPendingRepairs(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.base}/pending`);
  }

  // Additional methods (create/update/delete) can be added here
}
