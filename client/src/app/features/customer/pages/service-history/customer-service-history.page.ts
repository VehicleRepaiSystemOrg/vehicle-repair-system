import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // <--- THIS IS THE FIX
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-customer-service-history-page',
  // Make sure CommonModule is in this imports array:
  imports: [CommonModule, RouterLink], 
  templateUrl: './customer-service-history.page.html',
  styleUrl: './customer-service-history.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerServiceHistoryPageComponent {
  
  // TODO (backend): Replace mock data with API call
  // GET /customer/service-history - Fetch all service history records
  // Expected response: Array of { date, type, workPerformed, partsUsed, invoiceId }
  // Sample Data for the table
  readonly rows = [
    { 
      date: new Date('2023-08-15'), 
      type: 'Oil Change', 
      workPerformed: 'Replaced engine oil and oil filter', 
      partsUsed: 'Synthetic oil, Oil filter' 
    },
    { 
      date: new Date('2023-05-20'), 
      type: 'Brake Service', 
      workPerformed: 'Replaced brake pads and rotors', 
      partsUsed: 'Brake pads, Rotors' 
    },
    { 
      date: new Date('2023-02-10'), 
      type: 'Tire Rotation', 
      workPerformed: 'Rotated and balanced tires', 
      partsUsed: 'N/A' 
    },
    { 
      date: new Date('2022-11-05'), 
      type: 'Alignment', 
      workPerformed: 'Adjusted wheel alignment', 
      partsUsed: 'N/A' 
    },
    { 
      date: new Date('2022-08-01'), 
      type: 'Inspection', 
      workPerformed: 'Comprehensive vehicle inspection', 
      partsUsed: 'N/A' 
    }
  ];

  // TODO (backend): Implement navigation to invoice overview when "View Invoice" is clicked
  // Method should navigate to: /dashboard/invoice-overview/:invoiceId
  viewInvoice(invoiceId: string): void {
    // TODO (backend): Navigate to invoice overview page with invoice ID
    console.debug('[ServiceHistory] View Invoice clicked for:', invoiceId);
  }
}
