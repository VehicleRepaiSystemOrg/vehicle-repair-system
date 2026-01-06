import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { AppointmentService, AppointmentRequest } from '../../../../customer/services/appointment.service';
import { ServiceService, Service } from '../../services/service.service';
import { StaffService } from '../../../staff/services/staff.service';

/**
 * Appointment Requests Component
 * Displays pending appointment requests from customers
 * Allows admin to accept and convert them to services or decline them
 */
@Component({
  selector: 'app-appointment-requests',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './appointment-requests.component.html',
  styleUrls: ['./appointment-requests.component.scss']
})
export class AppointmentRequestsComponent implements OnInit {
  private readonly appointmentService = inject(AppointmentService);
  private readonly serviceService = inject(ServiceService);
  private readonly staffService = inject(StaffService);

  // Signals
  readonly pendingAppointments = toSignal(
    this.appointmentService.getAppointments(),
    { initialValue: [] as AppointmentRequest[] }
  );
  
  // Filter pending appointments
  readonly pendingRequests = computed(() => 
    this.pendingAppointments().filter(apt => apt.status === 'pending')
  );

  readonly approvedRequests = computed(() => 
    this.pendingAppointments().filter(apt => apt.status === 'approved')
  );

  readonly declinedRequests = computed(() => 
    this.pendingAppointments().filter(apt => apt.status === 'declined')
  );

  readonly pendingCount = computed(() => this.pendingRequests().length);
  readonly approvedCount = computed(() => this.approvedRequests().length);
  readonly declinedCount = computed(() => this.declinedRequests().length);

  // UI State
  readonly showDeclineForm = signal<Record<string, boolean>>({});
  readonly declineReasons = signal<Record<string, string>>({});
  readonly selectedTab = signal<'pending' | 'approved' | 'declined'>('pending');

  ngOnInit(): void {
    // Initialize staff service to load available staff
    this.staffService.staff$.subscribe();
  }

  /**
   * Get customer name for appointment (using email or fallback)
   */
  getCustomerName(): string {
    // For now, we don't have customer mapping, so use a generic name
    // In a real app, you'd have customer info in the appointment
    return 'Customer';
  }

  /**
   * Accept an appointment request and create a service
   */
  acceptAppointment(appointment: AppointmentRequest): void {
    // Create a new service from the appointment
    const newService: Omit<Service, 'id' | 'createdAt' | 'updatedAt'> = {
      customerName: this.getCustomerName(),
      vehicle: appointment.vehicleType,
      numberPlate: '', // Could be in appointment if captured
      serviceType: appointment.serviceTitle,
      date: appointment.preferredDate,
      time: '09:00', // Default time, could be in appointment
      status: 'Pending',
      tags: [], // Can be set to description parts
      description: appointment.description,
      assignedStaff: []
    };

    // Create service
    const createdService = this.serviceService.addService(newService);
    console.log('[AppointmentRequests] Service created:', createdService);

    // Update appointment status to approved
    this.appointmentService.updateAppointment(appointment.id, {
      status: 'approved'
    });

    // Optional: Show notification
    alert(`Appointment "${appointment.serviceTitle}" accepted and added to Service Management!`);
  }

  /**
   * Toggle decline form visibility
   */
  toggleDeclineForm(appointmentId: string): void {
    this.showDeclineForm.update(state => ({
      ...state,
      [appointmentId]: !state[appointmentId]
    }));
  }

  /**
   * Decline an appointment request
   */
  declineAppointment(appointment: AppointmentRequest): void {
    const reason = this.declineReasons()[appointment.id] || 'Not specified';

    this.appointmentService.updateAppointment(appointment.id, {
      status: 'declined',
      declineReason: reason
    });

    // Reset form
    this.showDeclineForm.update(state => ({
      ...state,
      [appointment.id]: false
    }));
    this.declineReasons.update(state => ({
      ...state,
      [appointment.id]: ''
    }));

    alert(`Appointment "${appointment.serviceTitle}" declined.`);
  }

  /**
   * Update decline reason
   */
  updateDeclineReason(appointmentId: string, reason: string): void {
    this.declineReasons.update(state => ({
      ...state,
      [appointmentId]: reason
    }));
  }

  /**
   * Get display status for appointment
   */
  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'pending':
        return 'badge-pending';
      case 'approved':
        return 'badge-approved';
      case 'declined':
        return 'badge-declined';
      default:
        return '';
    }
  }

  /**
   * View images for an appointment
   */
  viewImages(): void {
    // Images can be viewed - implementation depends on modal/lightbox
  }

  /**
   * Switch tabs
   */
  switchTab(tab: 'pending' | 'approved' | 'declined'): void {
    this.selectedTab.set(tab);
  }
}
