import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { CustomerDashboardFacade } from '../../data-access/customer-dashboard.facade';
import { KpiCardComponent } from '../../layout/components/kpi-card.component';
import { CalendarWidgetComponent } from '../../../../ui/calendar-widget/calendar-widget.component';
import { ChatService } from '../../../../core/services/chat.service';
import { AppointmentService } from '../../services/appointment.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  standalone: true,
  selector: 'app-customer-overview-page',
  imports: [
    AsyncPipe,
    CommonModule,
    RouterLink, 
    KpiCardComponent, 
    CalendarWidgetComponent
  ],
  templateUrl: './customer-overview.page.html',
  styleUrl: './customer-overview.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerOverviewPageComponent implements OnInit {
  private readonly facade = inject(CustomerDashboardFacade);
  private readonly chatService = inject(ChatService);
  private readonly appointmentService = inject(AppointmentService);
  private readonly route = inject(ActivatedRoute);

  readonly kpis$ = this.facade.getKpis();
  readonly updates$ = this.facade.getRecentUpdates();
  readonly myRequests = toSignal(this.appointmentService.getAppointments(), {
    initialValue: []
  });

  // TODO (backend): Fetch customer profile from API
  readonly customerName = 'Customer Name';
  readonly vehicleLabel = 'Vehicle name #1234';

  ngOnInit(): void {
    // Log appointments changes for debugging
    this.appointmentService.getAppointments().subscribe(appointments => {
      console.log('[Overview] Appointments updated:', appointments);
    });

    // Handle scroll to my-requests section when navigating with fragment
    this.route.fragment.subscribe(fragment => {
      if (fragment === 'my-requests') {
        setTimeout(() => {
          const element = document.getElementById('my-requests-section');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 300);
      }
    });
  }

  openChat(): void {
    this.chatService.open();
  }

  getStatusBadgeClass(status: string): string {
    return `status-${status}`;
  }

  getPendingCount(): number {
    return this.myRequests().filter((r: { status: string }) => r.status === 'pending').length;
  }
}