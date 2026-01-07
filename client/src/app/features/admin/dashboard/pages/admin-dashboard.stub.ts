import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Required for | async pipe
import { Observable, of } from 'rxjs';
import { computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
// Import your child components
import { StatCardComponent } from '../components/stat-card.component';
import { CalendarWidgetComponent } from '../components/calendar-widget.component';
import { RepairTableComponent } from '../components/repair-table.component';
import { AppointmentRequestsQuickComponent } from '../components/appointment-requests-quick.component';
import { OngoingServicesTableComponent } from '../components/ongoing-services-table.component';
import { ServiceService } from '../../service_management/services/service.service';
import { AppointmentService } from '../../../customer/services/appointment.service';
import { StaffService } from '../../staff/services/staff.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  // Add child components and CommonModule to imports
  imports: [
    CommonModule, 
    StatCardComponent, 
    CalendarWidgetComponent, 
    RepairTableComponent,
    AppointmentRequestsQuickComponent,
    OngoingServicesTableComponent
  ],
  templateUrl: './admin-dashboard.stub.html',
  styleUrls: ['./admin-dashboard.stub.scss']
})
export class AdminDashboardStubComponent implements OnInit {
  private readonly serviceService = inject(ServiceService);
  private readonly appointmentService = inject(AppointmentService);
  private readonly staffService = inject(StaffService);

  // FIX: Define the property the HTML is looking for
  // Using 'of' to create a mock observable for now
  availableStaffCount$: Observable<string> = of('3 / 5');

  // Appointment requests signal
  readonly appointmentRequests = toSignal(
    this.appointmentService.getAppointments(),
    { initialValue: [] }
  );

  // Count pending appointments
  readonly pendingRequestsCount = computed(() => 
    this.appointmentRequests().filter(apt => apt.status === 'pending').length
  );

  // Services signal
  readonly services = toSignal(
    this.serviceService.allServices$,
    { initialValue: [] }
  );

  // Count in-progress services
  readonly inProgressServicesCount = computed(() => 
    this.services().filter(s => 
      s.status === 'In Progress' || s.status === 'Inspection' || s.status === 'Estimate Approved'
    ).length
  );

  ngOnInit(): void {
    // Initialize services
    this.staffService.staff$.subscribe();
  }
}
