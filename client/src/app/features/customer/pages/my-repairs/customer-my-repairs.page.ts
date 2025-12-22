import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { CustomerDashboardFacade } from '../../data-access/customer-dashboard.facade';

@Component({
  standalone: true,
  selector: 'app-customer-my-repairs-page',
  imports: [AsyncPipe],
  templateUrl: './customer-my-repairs.page.html',
  styleUrl: './customer-my-repairs.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerMyRepairsPageComponent {
  private readonly facade = inject(CustomerDashboardFacade);

  // TODO (backend): Fetch customer profile from API
  // GET /customer/me - Fetch current customer profile
  readonly customerName = 'Customer Name';
  readonly vehicleLabel = 'Vehicle name #1234';

  readonly pastRepairs$ = this.facade.getPastRepairs();

  // TODO (backend): Fetch current/active repairs from API
  // GET /customer/repairs?status=active - Fetch active repairs
  // Expected response: Array of { id, title, vehicle, scheduledDate, status, images: [] }
  readonly currentRepairs = [
    { title: '2018 Sedan - Oil Change', when: 'Scheduled for tomorrow, 9:00 AM' },
    { title: '2020 SUV - Tire Replacement', when: 'Scheduled for next week, 10:00 AM' },
  ];

  // TODO (backend): Fetch vehicle image from API
  // GET /customer/vehicles/:vehicleId/image - Fetch vehicle image
  readonly heroCarImageUrl = '/assets/images/customer-car.jpg';

  // TODO (backend): Implement repair detail view navigation
  // Should navigate to: /dashboard/my-repairs/:repairId
  viewRepairDetails(repairId: string): void {
    // TODO (backend): Navigate to repair details page
    console.debug('[MyRepairs] View repair details clicked for:', repairId);
  }
}
