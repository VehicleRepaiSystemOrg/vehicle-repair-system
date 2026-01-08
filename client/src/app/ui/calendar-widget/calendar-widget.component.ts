import { ChangeDetectionStrategy, Component, signal, Input, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
// CORRECT: Import the Module, not the Component
import { FullCalendarModule } from '@fullcalendar/angular'; 
import { CalendarOptions, EventClickArg, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { AppointmentService, Appointment } from '../../core/services/appointment.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-calendar-widget',
  standalone: true,
  // CORRECT: Add the Module to imports
  imports: [CommonModule, FullCalendarModule], 
  template: `
    <div class="calendar-wrapper">
      <full-calendar [options]="calendarOptions()"></full-calendar>
    </div>
  `,
  styleUrl: './calendar-widget.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarWidgetComponent implements OnInit, OnDestroy {
  @Input() customerId?: number; // Optional customer ID to filter appointments
  @Input() showTeamAvailability = true; // Show team availability by default

  private readonly appointmentService = inject(AppointmentService);
  private subscription?: Subscription;

  availableMembers: EventInput[] = [
    { title: 'Mike R.', date: '2026-01-05', className: 'event-mechanic' },
    { title: 'Sarah L.', date: '2026-01-05', className: 'event-mechanic' },
    { title: 'Full Team', date: '2026-01-12', className: 'event-all', display: 'background', color: '#e8f5e9' },
  ];

  calendarOptions = signal<CalendarOptions>({
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'title',
      center: '',
      right: 'prev,next today'
    },
    events: [],
    eventClick: (arg: EventClickArg) => {
      const appointment = arg.event.extendedProps['appointment'];
      if (appointment) {
        const message = `📅 Appointment Details:\n\n` +
          `Service: ${appointment.service}\n` +
          `Date: ${this.formatDate(appointment.date)}\n` +
          `Time: ${appointment.time}\n` +
          `Vehicle: ${appointment.vehicle}\n` +
          (appointment.notes ? `\nNotes: ${appointment.notes}` : '');
        alert(message);
      }
    },
    height: 'auto',
  });

  ngOnInit(): void {
    // Subscribe to appointments and update calendar
    this.subscription = this.appointmentService.allAppointments$.subscribe(appointments => {
      this.updateCalendarEvents(appointments);
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  private updateCalendarEvents(appointments: Appointment[]): void {
    const events: EventInput[] = [];

    // Add team availability if enabled
    if (this.showTeamAvailability) {
      events.push(...this.availableMembers);
    }

    // Filter appointments by customer ID if provided
    let customerAppointments = appointments;
    if (this.customerId) {
      customerAppointments = appointments.filter(apt => apt.customerId === this.customerId);
    }

    // Add customer appointments
    customerAppointments.forEach(apt => {
      const dateStr = apt.date; // Format: YYYY-MM-DD
      const timeStr = apt.time; // Format: "10:00 AM" or "14:30"
      
      // Parse time to 24-hour format if needed
      let hours = 10;
      let minutes = 0;
      
      if (timeStr) {
        const timeMatch = timeStr.match(/(\d+):(\d+)\s*(AM|PM)?/i);
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
      
      const hoursStr = hours.toString().padStart(2, '0');
      const minutesStr = minutes.toString().padStart(2, '0');
      
      events.push({
        title: `${apt.service} - ${apt.time}`,
        start: `${dateStr}T${hoursStr}:${minutesStr}:00`,
        className: 'event-appointment',
        color: '#EA2A33',
        backgroundColor: '#EA2A33',
        borderColor: '#EA2A33',
        textColor: '#ffffff',
        extendedProps: {
          appointment: apt
        }
      });
    });

    // Update calendar options
    this.calendarOptions.update(options => ({
      ...options,
      events: events
    }));
  }

  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }
}