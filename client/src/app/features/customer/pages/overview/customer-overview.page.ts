import { ChangeDetectionStrategy, Component, inject, OnInit, OnDestroy } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { Subscription } from 'rxjs';
import { CustomerDashboardFacade } from '../../data-access/customer-dashboard.facade';
import { KpiCardComponent } from '../../layout/components/kpi-card.component';
import { CalendarWidgetComponent } from '../../../../ui/calendar-widget/calendar-widget.component';
import { ChatService } from '../../../../core/services/chat.service';
import { AppointmentService, Appointment } from '../../../../core/services/appointment.service';

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
export class CustomerOverviewPageComponent implements OnInit, OnDestroy {
  private readonly facade = inject(CustomerDashboardFacade);
  private readonly chatService = inject(ChatService);
  private readonly appointmentService = inject(AppointmentService);
  private readonly route = inject(ActivatedRoute);
  private subscription?: Subscription;

  readonly kpis$ = this.facade.getKpis();
  readonly updates$ = this.facade.getRecentUpdates();
  readonly myRequests = toSignal(this.appointmentService.allAppointments$, {
    initialValue: []
  });

  // TODO (backend): Fetch customer profile from API
  readonly customerName = 'Customer Name';
  readonly vehicleLabel = 'Vehicle name #1234';
  
  // TODO: Get customer ID from auth service
  readonly customerId = 1; // This should come from authentication
  upcomingAppointments: Appointment[] = [];

  ngOnInit(): void {
    // Subscribe to appointments for this customer
    this.subscription = this.appointmentService.allAppointments$.subscribe(appointments => {
      // Filter appointments for this customer and future dates
      const today = new Date().toISOString().split('T')[0];
      this.upcomingAppointments = appointments
        .filter(apt => apt.customerId === this.customerId && apt.date >= today)
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(0, 5); // Show only next 5 appointments
    });

    // Log appointments changes for debugging
    this.appointmentService.allAppointments$.subscribe(appointments => {
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

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  }

  getDaysUntil(dateString: string): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const appointmentDate = new Date(dateString);
    appointmentDate.setHours(0, 0, 0, 0);
    const diffTime = appointmentDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  openGoogleCalendar(link?: string): void {
    if (link) {
      window.open(link, '_blank');
    }
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