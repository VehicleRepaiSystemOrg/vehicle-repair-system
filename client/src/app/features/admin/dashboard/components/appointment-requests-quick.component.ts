import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { AppointmentService, AppointmentRequest } from '../../../customer/services/appointment.service';

/**
 * Appointment Requests Quick View Component
 * Shows a quick preview of pending appointment requests on the dashboard
 */
@Component({
  selector: 'app-appointment-requests-quick',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './appointment-requests-quick.component.html',
  styleUrls: ['./appointment-requests-quick.component.scss']
})
export class AppointmentRequestsQuickComponent {
  private readonly appointmentService = inject(AppointmentService);
  private readonly router = inject(Router);

  // Get all appointments
  readonly allAppointments = toSignal(
    this.appointmentService.getAppointments(),
    { initialValue: [] as AppointmentRequest[] }
  );

  // Show expand/collapse state
  readonly isExpanded = signal(false);

  /**
   * Get pending appointments (up to 5)
   */
  getPendingAppointments(): AppointmentRequest[] {
    return this.allAppointments()
      .filter(apt => apt.status === 'pending')
      .slice(0, 5);
  }

  /**
   * Get total pending count
   */
  getPendingCount(): number {
    return this.allAppointments().filter(apt => apt.status === 'pending').length;
  }

  /**
   * Toggle expanded view
   */
  toggleExpanded(): void {
    this.isExpanded.update(v => !v);
  }

  /**
   * Navigate to full appointment requests page
   */
  viewAllRequests(): void {
    this.router.navigate(['/service_management/requests']);
  }

  /**
   * Get service title (truncated)
   */
  getTruncatedTitle(title: string, maxLength = 20): string {
    if (title.length > maxLength) {
      return title.substring(0, maxLength) + '...';
    }
    return title;
  }

  /**
   * Get days remaining
   */
  getDaysRemaining(dateString: string): string {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(date.getTime() - today.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    return `${diffDays} days`;
  }
}
