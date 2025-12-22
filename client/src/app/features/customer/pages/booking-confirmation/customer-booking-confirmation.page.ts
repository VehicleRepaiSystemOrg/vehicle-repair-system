import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-customer-booking-confirmation-page',
  imports: [RouterLink],
  templateUrl: './customer-booking-confirmation.page.html',
  styleUrl: './customer-booking-confirmation.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerBookingConfirmationPageComponent {
  // TODO (backend): Fetch booking confirmation details from route params or query params
  // GET /customer/service-requests/:bookingId - Fetch booking details by ID
  // Expected response: { bookingId, confirmationNumber, status, serviceDate, vehicle, etc. }
  
  // TODO (backend): If booking ID is provided in route, fetch and display booking details
  // Otherwise, show generic success message
}



