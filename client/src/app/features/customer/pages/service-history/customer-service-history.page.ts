import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { AppointmentService } from '../../services/appointment.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  standalone: true,
  selector: 'app-customer-service-history-page',
  imports: [CommonModule, RouterLink], 
  templateUrl: './customer-service-history.page.html',
  styleUrl: './customer-service-history.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerServiceHistoryPageComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly appointmentService = inject(AppointmentService);

  readonly appointmentRequests = toSignal(
    this.appointmentService.getAppointments(),
    { initialValue: [] }
  );

  // Service history data (completed services)
  readonly rows = signal([
    { 
      date: new Date('2023-08-15'), 
      type: 'Oil Change', 
      workPerformed: 'Replaced engine oil and oil filter', 
      partsUsed: 'Synthetic oil, Oil filter' 
    },
    { 
      date: new Date('2023-05-20'), 
      type: 'Brake Service', 
      workPerformed: 'Replaced brake pads and rotors', 
      partsUsed: 'Brake pads, Rotors' 
    },
    { 
      date: new Date('2023-02-10'), 
      type: 'Tire Rotation', 
      workPerformed: 'Rotated and balanced tires', 
      partsUsed: 'N/A' 
    },
    { 
      date: new Date('2022-11-05'), 
      type: 'Alignment', 
      workPerformed: 'Adjusted wheel alignment', 
      partsUsed: 'N/A' 
    },
    { 
      date: new Date('2022-08-01'), 
      type: 'Inspection', 
      workPerformed: 'Comprehensive vehicle inspection', 
      partsUsed: 'N/A' 
    }
  ]);

  // TODO (backend): Implement navigation to invoice overview when "View Invoice" is clicked
  // Method should navigate to: /dashboard/invoice-overview/:invoiceId
  viewInvoice(invoiceId: string): void {
    // TODO (backend): Navigate to invoice overview page with invoice ID
    console.debug('[ServiceHistory] View Invoice clicked for:', invoiceId);
  }

  // Edit pending appointment request
  editAppointment(appointmentId: string): void {
    this.router.navigate(['/dashboard/book-service-appointment'], {
      queryParams: { editId: appointmentId }
    });
  }

  // Cancel appointment request
  cancelAppointment(appointmentId: string): void {
    if (confirm('Are you sure you want to cancel this appointment request?')) {
      this.appointmentService.deleteAppointment(appointmentId);
      console.debug('[ServiceHistory] Appointment cancelled:', appointmentId);
    }
  }

  // Book another date for declined appointment
  bookAnotherDate(appointment: { id: string; serviceTitle: string; description: string; vehicleType: string }): void {
    this.router.navigate(['/dashboard/book-service-appointment'], {
      queryParams: {
        editId: appointment.id,
        prefill: JSON.stringify({
          serviceTitle: appointment.serviceTitle,
          description: appointment.description,
          vehicleType: appointment.vehicleType,
        })
      }
    });
  }

  getStatusBadgeClass(status: string): string {
    return `status-${status}`;
  }
}
