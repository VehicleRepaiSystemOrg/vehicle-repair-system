import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { GoogleCalendarService } from './google-calendar.service';

export interface Appointment {
  id?: string | number;
  customerId?: number;
  customerName: string;
  vehicle: string;
  numberPlate?: string;
  service: string;
  serviceId?: number;
  date: string;
  time: string;
  status: string;
  notes?: string;
  googleCalendarLink?: string;
  googleCalendarEventId?: string; // Store Google Calendar event ID for updates/deletes
}

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private readonly http = inject(HttpClient);
  private readonly googleCalendarService = inject(GoogleCalendarService);

  // TODO: Replace base URL with environment variable or central ApiService
  private base = '/api/appointments';

  // Local storage for appointments (until backend is ready)
  private appointments$ = new BehaviorSubject<Appointment[]>([]);

  // Public observable
  allAppointments$: Observable<Appointment[]> = this.appointments$.asObservable();

  constructor() {
    // Load from localStorage if available
    const stored = localStorage.getItem('appointments');
    if (stored) {
      try {
        const appointments = JSON.parse(stored);
        this.appointments$.next(appointments);
      } catch (e) {
        console.error('Error loading appointments from storage', e);
      }
    }
  }

  /**
   * Get pending repairs
   * Note: Frontend-only implementation - returns appointments with 'Scheduled' or 'Pending' status
   */
  getPendingRepairs(): Observable<Appointment[]> {
    // Frontend-only: Return appointments from local storage instead of API call
    const appointments = this.appointments$.value.filter(apt => 
      apt.status === 'Scheduled' || apt.status === 'Pending'
    );
    return of(appointments);
    
    // TODO: When backend is ready, uncomment this:
    // return this.http.get<Appointment[]>(`${this.base}/pending`).pipe(
    //   catchError(error => {
    //     console.error('Error fetching pending repairs:', error);
    //     return of([]);
    //   })
    // );
  }

  /**
   * Create a new appointment
   * Automatically syncs to Google Calendar when created
   * @param appointment - Appointment data (without id)
   * @param options - Optional settings for calendar sync
   * @returns Created appointment with Google Calendar link
   */
  createAppointment(
    appointment: Omit<Appointment, 'id'>,
    options?: { autoOpenCalendar?: boolean }
  ): Appointment {
    const newAppointment: Appointment = {
      ...appointment,
      id: Date.now(),
      status: appointment.status || 'Scheduled',
      googleCalendarLink: this.generateGoogleCalendarLink(appointment)
    };

    // Save appointment first (so it appears in calendar immediately)
    const current = this.appointments$.value;
    const updated = [...current, newAppointment];
    this.appointments$.next(updated);
    this.saveToStorage(updated);

    // Create event in Google Calendar (async, doesn't block UI)
    // This automatically syncs the appointment to Google Calendar
    this.googleCalendarService.createCalendarEvent(newAppointment).subscribe({
      next: (result) => {
        if (result.id) {
          // Successfully created event in Google Calendar via API
          newAppointment.googleCalendarEventId = result.id;
          newAppointment.googleCalendarLink = result.htmlLink || newAppointment.googleCalendarLink;
          
          // Update appointment with event ID
          const currentAppts = this.appointments$.value;
          const updatedAppts = currentAppts.map(apt => 
            apt.id === newAppointment.id ? newAppointment : apt
          );
          this.appointments$.next(updatedAppts);
          this.saveToStorage(updatedAppts);
          
          console.log('✅ Appointment automatically synced to Google Calendar', result);
        } else if (result.htmlLink) {
          // Fallback: Generated Google Calendar link (for manual add)
          newAppointment.googleCalendarLink = result.htmlLink;
          const currentAppts = this.appointments$.value;
          const updatedAppts = currentAppts.map(apt => 
            apt.id === newAppointment.id ? newAppointment : apt
          );
          this.appointments$.next(updatedAppts);
          this.saveToStorage(updatedAppts);
          
          console.log('📅 Google Calendar link generated. Click to add to calendar:', result.htmlLink);
          
          // Automatically open Google Calendar link if option is enabled
          if (options?.autoOpenCalendar && result.htmlLink) {
            window.open(result.htmlLink, '_blank');
          }
        }
      },
      error: (error) => {
        console.error('Failed to create Google Calendar event:', error);
        // Appointment is already saved, so calendar will still show it
        // The googleCalendarLink is still available for manual addition
      }
    });

    return newAppointment;
  }

  /**
   * Get appointments by customer ID
   */
  getAppointmentsByCustomerId(customerId: number): Appointment[] {
    return this.appointments$.value.filter(apt => apt.customerId === customerId);
  }

  /**
   * Get appointments by service ID
   */
  getAppointmentsByServiceId(serviceId: number): Appointment[] {
    return this.appointments$.value.filter(apt => apt.serviceId === serviceId);
  }

  /**
   * Get all appointments
   */
  getAllAppointments(): Appointment[] {
    return this.appointments$.value;
  }

  /**
   * Get appointments for a specific date
   */
  getAppointmentsByDate(date: string): Appointment[] {
    return this.appointments$.value.filter(apt => apt.date === date);
  }

  /**
   * Update an appointment
   */
  updateAppointment(id: string | number, updates: Partial<Appointment>): void {
    const current = this.appointments$.value;
    const updated = current.map(apt => {
      if (apt.id === id) {
        const updatedAppt = { ...apt, ...updates };
        // Regenerate Google Calendar link if date/time changed
        if (updates.date || updates.time) {
          updatedAppt.googleCalendarLink = this.generateGoogleCalendarLink(updatedAppt);
        }

        // Update Google Calendar event if event ID exists
        if (updatedAppt.googleCalendarEventId) {
          this.googleCalendarService.updateCalendarEvent(
            updatedAppt.googleCalendarEventId,
            updatedAppt
          ).subscribe({
            next: (result) => {
              if (result.htmlLink) {
                updatedAppt.googleCalendarLink = result.htmlLink;
              }
            },
            error: (error) => {
              console.error('Failed to update Google Calendar event:', error);
            }
          });
        }

        return updatedAppt;
      }
      return apt;
    });
    this.appointments$.next(updated);
    this.saveToStorage(updated);
  }

  /**
   * Delete an appointment
   */
  deleteAppointment(id: string | number): void {
    const current = this.appointments$.value;
    const appointment = current.find(apt => apt.id === id);
    
    // Delete from Google Calendar if event ID exists
    if (appointment?.googleCalendarEventId) {
      this.googleCalendarService.deleteCalendarEvent(appointment.googleCalendarEventId).subscribe({
        next: () => {
          console.log('Google Calendar event deleted');
        },
        error: (error) => {
          console.error('Failed to delete Google Calendar event:', error);
        }
      });
    }

    const updated = current.filter(apt => apt.id !== id);
    this.appointments$.next(updated);
    this.saveToStorage(updated);
  }

  /**
   * Generate Google Calendar link for an appointment
   */
  generateGoogleCalendarLink(appointment: Appointment): string {
    // Validate inputs
    if (!appointment.date || !appointment.time) {
      console.warn('Invalid appointment date or time, using current date/time as fallback');
      const now = new Date();
      const fallbackDate = now.toISOString().split('T')[0];
      const fallbackTime = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
      return this.generateGoogleCalendarLink({
        ...appointment,
        date: fallbackDate,
        time: fallbackTime
      });
    }

    // Parse time string (format: "10:00 AM" or "14:30")
    let hours = 10;
    let minutes = 0;
    
    if (appointment.time) {
      const timeMatch = appointment.time.match(/(\d+):(\d+)\s*(AM|PM)?/i);
      if (timeMatch) {
        hours = parseInt(timeMatch[1], 10);
        minutes = parseInt(timeMatch[2], 10);
        const ampm = timeMatch[3]?.toUpperCase();
        
        if (ampm === 'PM' && hours !== 12) {
          hours += 12;
        } else if (ampm === 'AM' && hours === 12) {
          hours = 0;
        }
      }
    }
    
    // Create proper date-time string
    const hoursStr = hours.toString().padStart(2, '0');
    const minutesStr = minutes.toString().padStart(2, '0');
    const dateTimeStr = `${appointment.date}T${hoursStr}:${minutesStr}:00`;
    
    // Create Date object
    let startDate = new Date(dateTimeStr);
    
    // Validate date - if invalid, use current date with specified time
    if (isNaN(startDate.getTime())) {
      console.warn('Invalid date string:', dateTimeStr, 'Using fallback');
      // Fallback to current date/time
      startDate = new Date();
      startDate.setHours(hours, minutes, 0, 0);
    }
    
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour default

    const formatDate = (date: any): string => {
      try {
        const d = new Date(date);
        // Check if date is valid
        if (isNaN(d.getTime())) {
          console.warn('Invalid date detected, using current date as fallback:', date);
          return new Date().toISOString().replace(/-|:|\.\d\d\d/g, '');
        }
        return d.toISOString().replace(/-|:|\.\d\d\d/g, '');
      } catch (e) {
        console.error('Error formatting date:', e);
        return new Date().toISOString().replace(/-|:|\.\d\d\d/g, '');
      }
    };

    const title = encodeURIComponent(`Service: ${appointment.service} - ${appointment.vehicle}`);
    const details = encodeURIComponent(
      `Customer: ${appointment.customerName}\n` +
      `Vehicle: ${appointment.vehicle}\n` +
      (appointment.numberPlate ? `Number Plate: ${appointment.numberPlate}\n` : '') +
      (appointment.notes ? `Notes: ${appointment.notes}` : '')
    );
    const location = encodeURIComponent('AutoCare Service Center');
    const start = formatDate(startDate);
    const end = formatDate(endDate);

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;
  }

  /**
   * Save appointments to localStorage
   */
  private saveToStorage(appointments: Appointment[]): void {
    try {
      localStorage.setItem('appointments', JSON.stringify(appointments));
    } catch (e) {
      console.error('Error saving appointments to storage', e);
    }
  }
}
