import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { CustomerService, Customer } from '../../services/customer.service';
import { AppointmentService } from '../../../../../core/services/appointment.service';

@Component({
  selector: 'app-update-status',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink,
    FormsModule 
  ],
  templateUrl: './update-status.component.html',
  styleUrls: ['./update-status.component.scss']
})
export class UpdateStatusComponent implements OnInit {
  // Dependency Injection
  private customerService = inject(CustomerService);
  private appointmentService = inject(AppointmentService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // Status Tracking Properties
  customerId: string | null = null;
  customer: Customer = {} as Customer;
  statuses = ['Pending', 'Inspection', 'Estimate Approved', 'In Progress', 'Quality Check', 'Pickup'];

  // Scheduling Properties
  nextSessionDate = '';
  nextSessionTime = '10:00'; // Default time
  nextSessionNotes = '';

  ngOnInit() {
    // Get the ID from the URL
    this.customerId = this.route.snapshot.paramMap.get('id');

    // Fetch customer data if ID exists
    if (this.customerId) {
      const idAsNumber = +this.customerId;
      const found = this.customerService.getCustomerById(idAsNumber);
      if (found) {
        this.customer = { ...found };
      }
    }
  }

  // --- Status Logic ---
  setStatus(status: string) {
    this.customer.status = status;
    this.customerService.updateCustomer(this.customer);
    this.router.navigate(['/customer_overview']);
  }

  getProgress() {
    if (!this.customer.status) return 0;
    const index = this.statuses.indexOf(this.customer.status);
    return ((index + 1) / this.statuses.length) * 100;
  }

  isReached(status: string) {
    const currentIndex = this.statuses.indexOf(this.customer.status);
    const statusIndex = this.statuses.indexOf(status);
    return statusIndex <= currentIndex;
  }

  // --- Scheduling Logic ---
  saveSchedule() {
    if (!this.nextSessionDate) {
      alert('Please select a date for the next session');
      return;
    }

    // Format time for display (convert 24h to 12h format)
    const timeParts = this.nextSessionTime.split(':');
    let hours = parseInt(timeParts[0], 10);
    const minutes = timeParts[1] || '00';
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const timeDisplay = `${hours}:${minutes} ${ampm}`;

    // Get the first vehicle from the vehicles array (Customer has vehicles array, not single vehicle)
    const firstVehicle = this.customer.vehicles && this.customer.vehicles.length > 0 
      ? this.customer.vehicles[0] 
      : { name: 'Unknown Vehicle', numberPlate: '' };

    // Create appointment - automatically syncs to Google Calendar
    const appointment = this.appointmentService.createAppointment({
      customerId: this.customer.id,
      customerName: this.customer.name || 'Unknown Customer',
      vehicle: firstVehicle.name || 'Unknown Vehicle',
      numberPlate: firstVehicle.numberPlate || '',
      service: 'Service Appointment',
      date: this.nextSessionDate,
      time: timeDisplay,
      status: 'Scheduled',
      notes: this.nextSessionNotes || `Next session scheduled for ${this.customer.name}`
    });

    // Show success message
    alert(
      `✅ Appointment scheduled successfully!\n\n` +
      `Customer: ${this.customer.name}\n` +
      `Date: ${this.nextSessionDate}\n` +
      `Time: ${timeDisplay}\n\n` +
      `The appointment has been automatically synced to Google Calendar.`
    );

    // Offer to open Google Calendar
    if (appointment.googleCalendarLink) {
      const openCalendar = confirm('Would you like to view the appointment in Google Calendar?');
      if (openCalendar) {
        window.open(appointment.googleCalendarLink, '_blank');
      }
    }
  }
}