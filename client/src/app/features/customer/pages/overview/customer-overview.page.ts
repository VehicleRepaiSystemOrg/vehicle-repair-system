import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CustomerDashboardFacade } from '../../data-access/customer-dashboard.facade';
import { KpiCardComponent } from '../../layout/components/kpi-card.component';
import { CalendarWidgetComponent } from '../../../../ui/calendar-widget/calendar-widget.component';

@Component({
  standalone: true,
  selector: 'app-customer-overview-page',
  imports: [
    AsyncPipe, 
    RouterLink, 
    KpiCardComponent, 
    CalendarWidgetComponent // <--- Added here
  ],
  templateUrl: './customer-overview.page.html',
  styleUrl: './customer-overview.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerOverviewPageComponent {
  private readonly facade = inject(CustomerDashboardFacade);

  readonly kpis$ = this.facade.getKpis();
  readonly updates$ = this.facade.getRecentUpdates();

  // TODO (backend): Fetch customer profile from API
  readonly customerName = 'Customer Name';
  readonly vehicleLabel = 'Vehicle name #1234';

  // Note: logic for 'View Job Details' or 'Message Mechanic' can be expanded here
}