import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
// CORRECT: Import the Module, not the Component
import { FullCalendarModule } from '@fullcalendar/angular'; 
import { CalendarOptions, EventClickArg, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';

@Component({
  selector: 'app-calendar-widget',
  standalone: true,
  // CORRECT: Add the Module to imports
  imports: [FullCalendarModule], 
  template: `
    <div class="calendar-wrapper">
      <full-calendar [options]="calendarOptions()"></full-calendar>
    </div>
  `,
  styleUrl: './calendar-widget.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarWidgetComponent {
  availableMembers: EventInput[] = [
    { title: 'Mike R.', date: '2026-01-05', className: 'event-mechanic' },
    { title: 'Sarah L.', date: '2026-01-05', className: 'event-mechanic' },
    { title: 'Full Team', date: '2026-01-12', className: 'event-all', display: 'background', color: '#e8f5e9' },
  ];

  calendarOptions = signal<CalendarOptions>({
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'title',
      center: '',
      right: 'prev,next today'
    },
    events: this.availableMembers,
    //  - These handlers enable interaction
    dateClick: (arg: DateClickArg) => console.log('Date clicked:', arg.dateStr),
    eventClick: (arg: EventClickArg) => console.log('Event clicked:', arg.event.title),
    height: 'auto',
  });
}