import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CustomerDashboardFacade } from '../../data-access/customer-dashboard.facade';
import { KpiCardComponent } from '../../layout/components/kpi-card.component';

@Component({
  standalone: true,
  selector: 'app-customer-overview-page',
  imports: [AsyncPipe, RouterLink, KpiCardComponent],
  templateUrl: './customer-overview.page.html',
  styleUrl: './customer-overview.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerOverviewPageComponent {
  private readonly facade = inject(CustomerDashboardFacade);

  readonly kpis$ = this.facade.getKpis();
  readonly updates$ = this.facade.getRecentUpdates();

  // TODO (backend): Fetch customer profile from API
  // GET /customer/me - Fetch current customer profile
  // Expected response: { id, name, email, phone, vehicles: [{ id, make, model, year, licensePlate }] }
  readonly customerName = 'Customer Name';
  readonly vehicleLabel = 'Vehicle name #1234';

  // TODO (backend): Fetch vehicle image from API or use vehicle ID to construct image URL
  // GET /customer/vehicles/:vehicleId/image - Fetch vehicle image
  readonly carImageUrl = '/assets/images/customer-car.jpg';

  // TODO (backend): Implement "View Job Details" button click handler
  // Should navigate to repair details page: /dashboard/my-repairs/:repairId
  viewJobDetails(repairId: string): void {
    // TODO (backend): Navigate to repair details
    console.debug('[Overview] View Job Details clicked for:', repairId);
  }

  // TODO (backend): Implement "Message Mechanic" button click handler
  // Should open messaging interface or navigate to messages page
  messageMechanic(mechanicId: string): void {
    // TODO (backend): Open messaging interface or navigate to messages
    console.debug('[Overview] Message Mechanic clicked for:', mechanicId);
  }
}
