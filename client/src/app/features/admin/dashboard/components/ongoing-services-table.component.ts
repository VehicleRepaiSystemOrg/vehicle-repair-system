import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { ServiceService, Service } from '../../service_management/services/service.service';

/**
 * Ongoing Services Table Component
 * Displays services that are currently in progress (Inspection, Estimate Approved, In Progress)
 */
@Component({
  selector: 'app-ongoing-services-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ongoing-services-table.component.html',
  styleUrls: ['./ongoing-services-table.component.scss']
})
export class OngoingServicesTableComponent {
  private readonly serviceService = inject(ServiceService);

  // Get all services
  readonly allServices = toSignal(
    this.serviceService.allServices$,
    { initialValue: [] as Service[] }
  );

  /**
   * Get filtered ongoing services (non-completed statuses)
   */
  getOngoingServices(): Service[] {
    return this.allServices().filter(service => {
      const inProgressStatuses = ['Pending', 'Inspection', 'Estimate Approved', 'In Progress', 'Quality Check'];
      return inProgressStatuses.includes(service.status);
    });
  }

  /**
   * Get status badge class
   */
  getStatusClass(status: string): string {
    switch (status) {
      case 'Pending':
        return 'status-pending';
      case 'Inspection':
        return 'status-inspection';
      case 'Estimate Approved':
        return 'status-approved';
      case 'In Progress':
        return 'status-in-progress';
      case 'Quality Check':
        return 'status-quality-check';
      case 'Pickup':
        return 'status-pickup';
      default:
        return '';
    }
  }

  /**
   * Get assigned staff names
   */
  getStaffNames(service: Service): string {
    if (!service.assignedStaff || service.assignedStaff.length === 0) {
      return 'Not assigned';
    }
    return service.assignedStaff.map(s => s.name).join(', ');
  }
}
