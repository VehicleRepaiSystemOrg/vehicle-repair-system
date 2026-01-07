import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface AppointmentRequest {
  id: string;
  serviceTitle: string;
  description: string;
  vehicleType: string;
  preferredDate: string;
  images: string[];
  status: 'pending' | 'approved' | 'declined';
  createdAt: string;
  declineReason?: string;
}

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private readonly STORAGE_KEY = 'appointments';
  private appointments$ = new BehaviorSubject<AppointmentRequest[]>(this.loadAppointments());

  private loadAppointments(): AppointmentRequest[] {
    if (typeof localStorage === 'undefined') {
      return [];
    }
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  private saveAppointments(appointments: AppointmentRequest[]): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(appointments));
    }
  }

  getAppointments(): Observable<AppointmentRequest[]> {
    return this.appointments$.asObservable();
  }

  getAppointmentById(id: string): AppointmentRequest | undefined {
    return this.appointments$.value.find(apt => apt.id === id);
  }

  createAppointment(appointment: Omit<AppointmentRequest, 'id'>): AppointmentRequest {
    const newAppointment: AppointmentRequest = {
      ...appointment,
      id: `apt-${Date.now()}`,
    };
    const current = this.appointments$.value;
    const updated = [...current, newAppointment];
    this.appointments$.next(updated);
    this.saveAppointments(updated);
    console.log('[AppointmentService] Created appointment:', newAppointment);
    console.log('[AppointmentService] Current appointments:', this.appointments$.value);
    return newAppointment;
  }

  updateAppointment(id: string, updates: Partial<AppointmentRequest>): AppointmentRequest | undefined {
    const current = this.appointments$.value;
    const index = current.findIndex(apt => apt.id === id);
    if (index === -1) return undefined;

    const updated = { ...current[index], ...updates, id };
    const newAppointments = [...current];
    newAppointments[index] = updated;
    this.appointments$.next(newAppointments);
    this.saveAppointments(newAppointments);
    return updated;
  }

  deleteAppointment(id: string): boolean {
    const current = this.appointments$.value;
    const filtered = current.filter(apt => apt.id !== id);
    if (filtered.length === current.length) return false;

    this.appointments$.next(filtered);
    this.saveAppointments(filtered);
    return true;
  }
}
