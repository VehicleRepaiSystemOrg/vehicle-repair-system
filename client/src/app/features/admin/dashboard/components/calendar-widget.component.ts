import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { AppointmentService, Appointment } from '../../../../core/services/appointment.service';
import { ServiceService } from '../../service_management/services/service.service';
import { Subscription } from 'rxjs';

export interface Holiday {
  id: number;
  name: string;
  date: string; // YYYY-MM-DD format
  type: 'Holiday' | 'Poya' | 'Special Event';
}

@Component({
  selector: 'app-calendar-widget',
  standalone: true,
  imports: [CommonModule, FormsModule, FullCalendarModule],
  templateUrl: './calendar-widget.component.html',
  styleUrls: ['./calendar-widget.component.scss']
})
export class CalendarWidgetComponent implements OnInit, OnDestroy {
  private readonly appointmentService = inject(AppointmentService);
  private readonly serviceService = inject(ServiceService);
  private readonly sanitizer = inject(DomSanitizer);
  private subscription?: Subscription;

  // Toggle between Google Calendar and App Calendar
  showGoogleCalendar = true; // Default to Google Calendar

  // Google Calendar Configuration
  // TODO: Replace with your actual Google Calendar ID
  // To find your calendar ID: Google Calendar → Settings → Calendar Settings → Calendar ID
  private readonly googleCalendarId = 'primary'; // Use 'primary' for default calendar, or your specific calendar ID
  googleCalendarUrl: string | undefined;

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek'
    },
    firstDay: 1,
    height: 'auto',
    events: [],
    selectable: true,
    selectMirror: true,
    dateClick: (info) => {
      // Handle date click to add new appointment
      this.onDateClick(info.dateStr);
    },
    eventClick: (info) => {
      const event = info.event;
      const appointment = event.extendedProps['appointment'];
      const holiday = event.extendedProps['holiday'];
      
      if (holiday) {
        const message = `🎉 Holiday Details:\n\n` +
          `Name: ${holiday.name}\n` +
          `Date: ${this.formatDate(holiday.date)}\n` +
          `Type: ${holiday.type}\n\n` +
          `Click OK to delete this holiday.`;
        if (confirm(message)) {
          this.deleteHoliday(holiday.id);
        }
      } else if (appointment) {
        const message = `📅 Appointment Details:\n\n` +
          `Customer: ${appointment.customerName}\n` +
          `Vehicle: ${appointment.vehicle}\n` +
          (appointment.numberPlate ? `Number Plate: ${appointment.numberPlate}\n` : '') +
          `Service: ${appointment.service}\n` +
          `Date: ${this.formatDate(appointment.date)}\n` +
          `Time: ${appointment.time}\n` +
          `Status: ${appointment.status}\n` +
          (appointment.notes ? `\nNotes: ${appointment.notes}` : '') +
          (appointment.googleCalendarLink ? `\n\n✅ Synced with Google Calendar` : '');
        alert(message);
      }
    },
    eventDidMount: (info) => {
      // Add tooltip on hover
      if (info.event.extendedProps['holiday']) {
        const holiday = info.event.extendedProps['holiday'];
        info.el.setAttribute('title', `${holiday.name} - ${holiday.type}`);
      } else if (info.event.extendedProps['appointment']) {
        const apt = info.event.extendedProps['appointment'];
        info.el.setAttribute('title', `${apt.customerName} - ${apt.service} at ${apt.time}`);
      }
    }
  };

  // Modal state
  showAddAppointmentModal = false;
  showCallAppointmentModal = false;
  showAddHolidayModal = false;
  selectedDate = '';
  appointmentForm = {
    customerName: '',
    vehicle: '',
    numberPlate: '',
    service: '',
    time: '10:00 AM',
    timeInput: '10:00', // For HTML time input (24-hour format)
    notes: ''
  };
  callAppointmentForm = {
    customerName: '',
    phoneNumber: '',
    vehicle: '',
    numberPlate: '',
    service: '',
    date: new Date().toISOString().split('T')[0],
    time: '10:00 AM',
    timeInput: '10:00',
    notes: ''
  };
  holidayForm = {
    name: '',
    date: '',
    type: 'Holiday' // Holiday, Poya, Special Event
  };

  // Holidays storage
  private holidays: Holiday[] = [];

  ngOnInit(): void {
    // Initialize Google Calendar URL
    this.initializeGoogleCalendar();
    
    // Load holidays from localStorage
    this.loadHolidays();
    
    // Subscribe to appointments and update calendar
    this.subscription = this.appointmentService.allAppointments$.subscribe(appointments => {
      this.updateCalendarEvents(appointments);
    });
  }

  /**
   * Initialize Google Calendar embed URL
   */
  private initializeGoogleCalendar(): void {
    // Google Calendar embed URL format
    const baseUrl = 'https://calendar.google.com/calendar/embed';
    const params = new URLSearchParams({
      src: this.googleCalendarId,
      ctz: Intl.DateTimeFormat().resolvedOptions().timeZone, // User's timezone
      wkst: '1', // Week starts on Monday
      bgcolor: '#ffffff',
      color: '#EA2A33', // Theme red color
      showTitle: '1',
      showNav: '1',
      showDate: '1',
      showPrint: '0',
      showTabs: '1',
      showCalendars: '1',
      showTz: '1',
      mode: 'MONTH' // Default view: MONTH, AGENDA, WEEK
    });

    const url = `${baseUrl}?${params.toString()}`;
    this.googleCalendarUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  /**
   * Toggle between Google Calendar and App Calendar
   */
  toggleView(): void {
    this.showGoogleCalendar = !this.showGoogleCalendar;
  }

  /**
   * Handle date click to open appointment modal
   */
  onDateClick(dateStr: string): void {
    // Only show modal for App Calendar view
    if (!this.showGoogleCalendar) {
      this.selectedDate = dateStr;
      this.appointmentForm = {
        customerName: '',
        vehicle: '',
        numberPlate: '',
        service: '',
        time: '10:00 AM',
        timeInput: '10:00',
        notes: ''
      };
      this.showAddAppointmentModal = true;
    }
  }

  /**
   * Open call appointment modal
   */
  openCallAppointmentModal(): void {
    this.callAppointmentForm = {
      customerName: '',
      phoneNumber: '',
      vehicle: '',
      numberPlate: '',
      service: '',
      date: new Date().toISOString().split('T')[0],
      time: '10:00 AM',
      timeInput: '10:00',
      notes: ''
    };
    this.showCallAppointmentModal = true;
  }

  /**
   * Close call appointment modal
   */
  closeCallAppointmentModal(): void {
    this.showCallAppointmentModal = false;
  }

  /**
   * Create appointment from phone call
   */
  createCallAppointment(): void {
    if (!this.callAppointmentForm.customerName.trim() || 
        !this.callAppointmentForm.phoneNumber.trim() ||
        !this.callAppointmentForm.vehicle.trim() || 
        !this.callAppointmentForm.service.trim()) {
      alert('Please fill in customer name, phone number, vehicle, and service');
      return;
    }

    // Use the formatted time (already in AM/PM format)
    const timeDisplay = this.callAppointmentForm.time || this.formatTimeForDisplay(this.callAppointmentForm.timeInput);

    const customerName = this.callAppointmentForm.customerName.trim();
    const phoneNumber = this.callAppointmentForm.phoneNumber.trim();
    const vehicle = this.callAppointmentForm.vehicle.trim();
    const numberPlate = this.callAppointmentForm.numberPlate.trim();
    const serviceType = this.callAppointmentForm.service.trim();
    const notes = this.callAppointmentForm.notes.trim() || `Phone call appointment - Phone: ${phoneNumber}`;

    // Create service first
    this.serviceService.addService({
      customerName,
      vehicle,
      numberPlate,
      serviceType,
      date: this.callAppointmentForm.date,
      time: timeDisplay,
      status: 'Pending',
      description: notes || undefined,
      tags: []
    });

    // Create appointment for calendar
    this.appointmentService.createAppointment({
      customerName,
      vehicle,
      numberPlate,
      service: serviceType,
      date: this.callAppointmentForm.date,
      time: timeDisplay,
      status: 'Scheduled',
      notes: notes || undefined
    });

    alert('Call appointment created successfully!');
    this.closeCallAppointmentModal();
  }

  /**
   * Handle time change for call appointment
   */
  onCallAppointmentTimeChange(timeValue: string): void {
    this.callAppointmentForm.timeInput = timeValue;
    this.callAppointmentForm.time = this.formatTimeForDisplay(timeValue);
  }

  /**
   * Open add holiday modal
   */
  openAddHolidayModal(): void {
    this.holidayForm = {
      name: '',
      date: this.selectedDate || new Date().toISOString().split('T')[0],
      type: 'Holiday'
    };
    this.showAddHolidayModal = true;
  }

  /**
   * Close holiday modal
   */
  closeHolidayModal(): void {
    this.showAddHolidayModal = false;
  }

  /**
   * Load holidays from localStorage
   */
  private loadHolidays(): void {
    const stored = localStorage.getItem('calendar-holidays');
    if (stored) {
      try {
        this.holidays = JSON.parse(stored);
      } catch (e) {
        console.error('Error loading holidays', e);
        this.holidays = [];
      }
    }
  }

  /**
   * Save holidays to localStorage
   */
  private saveHolidays(): void {
    try {
      localStorage.setItem('calendar-holidays', JSON.stringify(this.holidays));
    } catch (e) {
      console.error('Error saving holidays', e);
    }
  }

  /**
   * Add a new holiday
   */
  addHoliday(): void {
    if (!this.holidayForm.name.trim() || !this.holidayForm.date) {
      alert('Please fill in holiday name and date');
      return;
    }

    const newHoliday: Holiday = {
      id: Date.now(),
      name: this.holidayForm.name.trim(),
      date: this.holidayForm.date,
      type: this.holidayForm.type as 'Holiday' | 'Poya' | 'Special Event'
    };

    // Check if holiday already exists for this date
    const existing = this.holidays.find(h => h.date === newHoliday.date && h.name === newHoliday.name);
    if (existing) {
      alert('This holiday already exists for this date');
      return;
    }

    this.holidays.push(newHoliday);
    this.saveHolidays();
    this.updateCalendarEvents(this.appointmentService.getAllAppointments());
    alert('Holiday added successfully!');
    this.closeHolidayModal();
  }

  /**
   * Delete a holiday
   */
  deleteHoliday(holidayId: number): void {
    if (confirm('Are you sure you want to delete this holiday?')) {
      this.holidays = this.holidays.filter(h => h.id !== holidayId);
      this.saveHolidays();
      this.updateCalendarEvents(this.appointmentService.getAllAppointments());
      alert('Holiday deleted successfully!');
    }
  }

  /**
   * Close appointment modal
   */
  closeModal(): void {
    this.showAddAppointmentModal = false;
    this.selectedDate = '';
  }

  /**
   * Format time input to AM/PM format
   */
  formatTimeForDisplay(timeInput: string): string {
    if (!timeInput) {
      return '10:00 AM';
    }
    
    // If already in AM/PM format, return as is
    if (timeInput.includes('AM') || timeInput.includes('PM')) {
      return timeInput;
    }
    
    // Convert 24-hour format (HH:MM) to 12-hour format (H:MM AM/PM)
    const [hours, minutes] = timeInput.split(':');
    const hour = parseInt(hours, 10);
    if (isNaN(hour)) {
      return '10:00 AM';
    }
    
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes || '00'} ${ampm}`;
  }

  /**
   * Handle time input change
   */
  onTimeChange(timeValue: string): void {
    this.appointmentForm.timeInput = timeValue;
    this.appointmentForm.time = this.formatTimeForDisplay(timeValue);
  }

  /**
   * Create appointment and service from modal form
   */
  createAppointment(): void {
    if (!this.appointmentForm.customerName.trim() || 
        !this.appointmentForm.vehicle.trim() || 
        !this.appointmentForm.service.trim()) {
      alert('Please fill in customer name, vehicle, and service');
      return;
    }

    // Use the formatted time (already in AM/PM format)
    const timeDisplay = this.appointmentForm.time || this.formatTimeForDisplay(this.appointmentForm.timeInput);

    const customerName = this.appointmentForm.customerName.trim();
    const vehicle = this.appointmentForm.vehicle.trim();
    const numberPlate = this.appointmentForm.numberPlate.trim();
    const serviceType = this.appointmentForm.service.trim();
    const notes = this.appointmentForm.notes.trim();

    // Create service first
    this.serviceService.addService({
      customerName,
      vehicle,
      numberPlate,
      serviceType,
      date: this.selectedDate,
      time: timeDisplay,
      status: 'Pending',
      description: notes || undefined,
      tags: []
    });

    // Create appointment for calendar
    this.appointmentService.createAppointment({
      customerName,
      vehicle,
      numberPlate,
      service: serviceType,
      date: this.selectedDate,
      time: timeDisplay,
      status: 'Scheduled',
      notes: notes || undefined
    });

    alert('Service and appointment created successfully!');
    this.closeModal();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  /**
   * Format date for display
   */
  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  /**
   * Update calendar events from appointments
   */
  private updateCalendarEvents(appointments: Appointment[]): void {
    const events: EventInput[] = [
      // Keep existing mock data for staff availability
      { title: 'Liam H. (Available)', start: '2026-01-05', color: '#28a745' },
      { title: 'Olivia B. (Available)', start: '2026-01-05', color: '#28a745' },
      { title: 'Noah C. (Available)', start: '2026-01-06', color: '#28a745' },
      { title: 'Brake Specialist In', start: '2026-01-08', color: '#3182CE' }
    ];

    // Add holidays
    this.holidays.forEach(holiday => {
      let color = '#FF6B6B'; // Default red for holidays
      if (holiday.type === 'Poya') {
        color = '#4ECDC4'; // Teal for Poya days
      } else if (holiday.type === 'Special Event') {
        color = '#FFE66D'; // Yellow for special events
      }

      events.push({
        title: `🎉 ${holiday.name}`,
        start: holiday.date,
        allDay: true,
        color: color,
        backgroundColor: color,
        borderColor: color,
        textColor: '#ffffff',
        extendedProps: {
          holiday: holiday,
          isHoliday: true
        }
      });
    });

    // Add scheduled appointments from "Schedule Next Session"
    appointments.forEach(apt => {
      // Format date and time properly for FullCalendar
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
      
      // Create event with proper date-time format
      events.push({
        title: `${apt.customerName} - ${apt.service}`,
        start: `${dateStr}T${hoursStr}:${minutesStr}:00`,
        color: '#EA2A33', // Theme red color for appointments
        backgroundColor: '#EA2A33',
        borderColor: '#EA2A33',
        textColor: '#ffffff',
        extendedProps: {
          appointment: apt
        },
        // Add tooltip/description
        description: `Vehicle: ${apt.vehicle}\nService: ${apt.service}\nTime: ${apt.time}${apt.notes ? '\nNotes: ' + apt.notes : ''}`
      });
    });

    // Update calendar options
    this.calendarOptions = {
      ...this.calendarOptions,
      events: events
    };
  }
}
