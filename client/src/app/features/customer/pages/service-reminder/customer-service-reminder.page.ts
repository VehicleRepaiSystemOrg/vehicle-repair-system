import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CustomerDashboardFacade } from '../../data-access/customer-dashboard.facade';
import { of } from 'rxjs'; // Needed for the mock data

@Component({
  standalone: true,
  selector: 'app-customer-service-reminder-page',
  imports: [AsyncPipe, RouterLink],
  templateUrl: './customer-service-reminder.page.html',
  styleUrl: './customer-service-reminder.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerServiceReminderPageComponent {
  private readonly facade = inject(CustomerDashboardFacade);

  // TODO (backend): Fetch customer profile from API
  // GET /customer/me - Fetch current customer profile
  readonly customerName = 'Customer Name';
  readonly vehicleLabel = 'Vehicle name #1234';

  // TODO (backend): Fetch upcoming services from API
  // GET /customer/service-reminders?status=upcoming - Fetch upcoming service reminders
  // 1. Upcoming (Scheduled) Services from Facade
  readonly upcoming$ = this.facade.getUpcomingServices();

  // TODO (backend): Fetch completed service history from API
  // GET /customer/service-history?status=completed - Fetch completed service history
  // 2. Completed History (Mock data to fix the error and show the table)
  readonly completed$ = of([
    { 
      date: '2023-12-10', 
      vehicle: '2021 Sedan', 
      serviceType: 'Battery Replacement', 
      mileage: '9,500 miles', 
      status: 'Completed' 
    },
    { 
      date: '2023-11-05', 
      vehicle: '2019 SUV', 
      serviceType: 'Wheel Alignment', 
      mileage: '19,200 miles', 
      status: 'Completed' 
    },
    { 
      date: '2023-08-14', 
      vehicle: '2021 Sedan', 
      serviceType: 'Air Filter Change', 
      mileage: '8,000 miles', 
      status: 'Completed' 
    }
  ]);

  // TODO (backend): Implement "Book Service" button click handler
  // Should navigate to book service page with pre-filled vehicle/service type
  bookService(vehicleId: string, serviceType: string): void {
    // TODO (backend): Navigate to book service page with pre-filled data
    console.debug('[ServiceReminder] Book service clicked for:', { vehicleId, serviceType });
  }

  // TODO (backend): Implement "View Details" button click handler
  // Should show service reminder details or navigate to service history
  viewServiceDetails(serviceId: string): void {
    // TODO (backend): Show service details or navigate to service history
    console.debug('[ServiceReminder] View service details clicked for:', serviceId);
  }
}