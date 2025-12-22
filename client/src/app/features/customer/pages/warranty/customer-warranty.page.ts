import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { CustomerDashboardFacade } from '../../data-access/customer-dashboard.facade';

@Component({
  standalone: true,
  selector: 'app-customer-warranty-page',
  imports: [AsyncPipe],
  templateUrl: './customer-warranty.page.html',
  styleUrl: './customer-warranty.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerWarrantyPageComponent {
  private readonly facade = inject(CustomerDashboardFacade);

  // TODO (backend): Fetch customer profile from API
  // GET /customer/me - Fetch current customer profile
  readonly customerName = 'Customer Name';
  readonly vehicleLabel = 'Vehicle name #1234';

  // TODO (backend): These facade methods should call API endpoints
  // GET /customer/warranties?status=active - Fetch active warranties
  // GET /customer/warranties?status=expired - Fetch expired warranties
  readonly active$ = this.facade.getActiveWarranties();
  readonly expired$ = this.facade.getExpiredWarranties();

  // TODO (backend): Implement warranty detail view
  // Should navigate to warranty details or show modal with full warranty information
  viewWarrantyDetails(warrantyId: string): void {
    // TODO (backend): Navigate to warranty details or open modal
    console.debug('[Warranty] View warranty details clicked for:', warrantyId);
  }
}
