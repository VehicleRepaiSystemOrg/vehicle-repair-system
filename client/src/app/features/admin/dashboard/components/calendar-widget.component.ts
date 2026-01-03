import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

@Component({
  selector: 'app-calendar-widget',
  standalone: true,
  imports: [CommonModule, FullCalendarModule], // Ensure Module is here
  templateUrl: './calendar-widget.component.html',
  styleUrls: ['./calendar-widget.component.scss']
})
export class CalendarWidgetComponent {

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek'
    },
    // Theme consistency: Week starts on Monday
    firstDay: 1,
    height: 'auto',
    // Mock Data: Members Available per day
    events: [
      { title: 'Liam H. (Available)', start: '2026-01-05', color: '#28a745' },
      { title: 'Olivia B. (Available)', start: '2026-01-05', color: '#28a745' },
      { title: 'Noah C. (Available)', start: '2026-01-06', color: '#28a745' },
      { title: 'Shop Closed', start: '2026-01-01', color: '#EA2A33' },
      { title: 'Brake Specialist In', start: '2026-01-08', color: '#3182CE' }
    ],
    eventClick: (info) => {
      console.log('Member clicked:', info.event.title);
    }
  };
}
