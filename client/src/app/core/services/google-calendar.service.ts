import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Appointment } from './appointment.service';

export interface GoogleCalendarEvent {
  summary: string;
  description: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  location?: string;
  reminders?: {
    useDefault: boolean;
    overrides?: Array<{
      method: string;
      minutes: number;
    }>;
  };
}

@Injectable({ providedIn: 'root' })
export class GoogleCalendarService {
  private readonly http = inject(HttpClient);

  // Google Calendar API Configuration
  // 
  // HOW TO SET UP GOOGLE CALENDAR INTEGRATION:
  // 
  // Option 1: Full API Integration (Recommended for production)
  // 1. Go to Google Cloud Console (https://console.cloud.google.com/)
  // 2. Create a new project or select existing one
  // 3. Enable Google Calendar API
  // 4. Create credentials (API Key)
  // 5. Add the API key below
  // 
  // Option 2: Link-based (Current - Works without API key)
  // - The system automatically generates Google Calendar links
  // - Users can click the link to add events manually
  // - This works immediately without any setup
  //
  // TODO: Move to environment variables for production
  private readonly apiKey = ''; // Add your Google Calendar API key here for full integration
  private readonly calendarId = 'primary'; // Use 'primary' for default calendar, or your specific calendar ID
  private readonly apiBaseUrl = 'https://www.googleapis.com/calendar/v3';

  /**
   * Create an event in Google Calendar
   * 
   * This method automatically syncs appointments to Google Calendar:
   * - If API key is configured: Creates event directly via Google Calendar API
   * - If API key is not configured: Generates a Google Calendar link for manual addition
   * 
   * The appointment service calls this automatically when createAppointment() is called.
   * 
   * Note: For production, consider using backend API for better security.
   */
  createCalendarEvent(appointment: Appointment): Observable<any> {
    const event: GoogleCalendarEvent = {
      summary: `Service: ${appointment.service} - ${appointment.vehicle}`,
      description: this.formatEventDescription(appointment),
      start: {
        dateTime: this.formatDateTime(appointment.date, appointment.time),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      end: {
        dateTime: this.formatEndDateTime(appointment.date, appointment.time),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      location: 'AutoCare Service Center',
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // 1 day before
          { method: 'popup', minutes: 60 } // 1 hour before
        ]
      }
    };

    // If API key is configured, make the API call
    if (this.apiKey) {
      const url = `${this.apiBaseUrl}/calendars/${this.calendarId}/events`;
      const headers = new HttpHeaders({
        'Content-Type': 'application/json'
      });

      return this.http.post(url, event, { 
        headers,
        params: { key: this.apiKey }
      }).pipe(
        catchError(error => {
          console.error('Error creating Google Calendar event:', error);
          // Fallback to generating link
          return of({ 
            htmlLink: this.generateCalendarLink(appointment),
            error: 'API call failed, using fallback link'
          });
        })
      );
    }

    // Fallback: Return a link to add event manually
    return of({
      htmlLink: this.generateCalendarLink(appointment),
      method: 'link'
    });
  }

  /**
   * Format event description from appointment
   */
  private formatEventDescription(appointment: Appointment): string {
    let description = `Customer: ${appointment.customerName}\n`;
    description += `Vehicle: ${appointment.vehicle}\n`;
    if (appointment.numberPlate) {
      description += `Number Plate: ${appointment.numberPlate}\n`;
    }
    description += `Service: ${appointment.service}\n`;
    description += `Status: ${appointment.status}\n`;
    if (appointment.notes) {
      description += `\nNotes: ${appointment.notes}`;
    }
    return description;
  }

  /**
   * Format date and time for Google Calendar API
   */
  private formatDateTime(date: string, time: string): string {
    // Validate inputs
    if (!date || !time) {
      console.warn('Invalid date or time provided, using current date/time');
      const now = new Date();
      return now.toISOString();
    }

    // Parse time (format: "10:00 AM" or "14:30")
    const timeMatch = time.match(/(\d+):(\d+)\s*(AM|PM)?/i);
    if (!timeMatch) {
      // Default to 10:00 AM if parsing fails
      console.warn('Time parsing failed, using default 10:00 AM');
      return `${date}T10:00:00`;
    }

    let hours = parseInt(timeMatch[1], 10);
    const minutes = parseInt(timeMatch[2], 10);
    const ampm = timeMatch[3]?.toUpperCase();

    if (ampm === 'PM' && hours !== 12) {
      hours += 12;
    } else if (ampm === 'AM' && hours === 12) {
      hours = 0;
    }

    const hoursStr = hours.toString().padStart(2, '0');
    const minutesStr = minutes.toString().padStart(2, '0');

    const dateTimeStr = `${date}T${hoursStr}:${minutesStr}:00`;
    
    // Validate the resulting date string
    const testDate = new Date(dateTimeStr);
    if (isNaN(testDate.getTime())) {
      console.warn('Invalid date-time string:', dateTimeStr, 'Using current date/time');
      return new Date().toISOString();
    }

    return dateTimeStr;
  }

  /**
   * Format end date and time (1 hour after start)
   */
  private formatEndDateTime(date: string, time: string): string {
    try {
      const startDateTime = this.formatDateTime(date, time);
      const startDate = new Date(startDateTime);
      
      // Validate start date
      if (isNaN(startDate.getTime())) {
        console.warn('Invalid start date, using current date + 1 hour');
        const now = new Date();
        now.setHours(now.getHours() + 1);
        return now.toISOString();
      }
      
      const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // Add 1 hour
      return endDate.toISOString();
    } catch (e) {
      console.error('Error formatting end date/time:', e);
      const now = new Date();
      now.setHours(now.getHours() + 1);
      return now.toISOString();
    }
  }

  /**
   * Generate Google Calendar link (fallback method)
   */
  private generateCalendarLink(appointment: Appointment): string {
    // Validate and parse date/time
    if (!appointment.date || !appointment.time) {
      console.warn('Invalid appointment date or time, using current date/time as fallback');
      const now = new Date();
      const fallbackDate = now.toISOString().split('T')[0];
      const fallbackTime = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
      return this.generateCalendarLink({
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
    
    // Create Date object with validation
    let startDate = new Date(dateTimeStr);
    
    // Validate date - if invalid, use current date with specified time
    if (isNaN(startDate.getTime())) {
      console.warn('Invalid date string:', dateTimeStr, 'Using fallback');
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
    const details = encodeURIComponent(this.formatEventDescription(appointment));
    const location = encodeURIComponent('AutoCare Service Center');
    const start = formatDate(startDate);
    const end = formatDate(endDate);

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;
  }

  /**
   * Update calendar event
   */
  updateCalendarEvent(eventId: string, appointment: Appointment): Observable<any> {
    const event: GoogleCalendarEvent = {
      summary: `Service: ${appointment.service} - ${appointment.vehicle}`,
      description: this.formatEventDescription(appointment),
      start: {
        dateTime: this.formatDateTime(appointment.date, appointment.time),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      end: {
        dateTime: this.formatEndDateTime(appointment.date, appointment.time),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      location: 'AutoCare Service Center',
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
          { method: 'popup', minutes: 60 }
        ]
      }
    };

    if (this.apiKey && eventId) {
      const url = `${this.apiBaseUrl}/calendars/${this.calendarId}/events/${eventId}`;
      const headers = new HttpHeaders({
        'Content-Type': 'application/json'
      });

      return this.http.put(url, event, { 
        headers,
        params: { key: this.apiKey }
      }).pipe(
        catchError(error => {
          console.error('Error updating Google Calendar event:', error);
          return of({ error: 'Update failed' });
        })
      );
    }

    return of({ error: 'API key or event ID not configured' });
  }

  /**
   * Delete calendar event
   */
  deleteCalendarEvent(eventId: string): Observable<any> {
    if (this.apiKey && eventId) {
      const url = `${this.apiBaseUrl}/calendars/${this.calendarId}/events/${eventId}`;
      return this.http.delete(url, {
        params: { key: this.apiKey }
      }).pipe(
        catchError(error => {
          console.error('Error deleting Google Calendar event:', error);
          return of({ error: 'Delete failed' });
        })
      );
    }

    return of({ error: 'API key or event ID not configured' });
  }
}

