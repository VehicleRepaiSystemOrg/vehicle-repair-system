import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

// Interface for the history list
interface InvoiceHistoryItem {
  id: string;
  date: Date;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
}

// Existing interface
interface InvoiceItem {
  item: string;
  quantity: number;
  price: number;
  tax: number;
  total: number;
}

@Component({
  standalone: true,
  selector: 'app-customer-invoice-overview-page',
  imports: [RouterLink, CommonModule], // CommonModule includes NgFor, NgIf, Pipes
  templateUrl: './customer-invoice-overview.page.html',
  styleUrl: './customer-invoice-overview.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerInvoiceOverviewPageComponent {
  
  // TODO (backend): Fetch invoice ID from route params (e.g., ActivatedRoute) or query params
  // TODO (backend): GET /customer/invoices/:invoiceId - Fetch invoice details by ID
  // TODO (backend): GET /customer/invoices - Fetch invoice history list
  // --- NEW: History Data ---
  readonly currentInvoiceId = '0042';
  
  readonly invoiceHistory: InvoiceHistoryItem[] = [
    { id: '0042', date: new Date('2024-06-15'), amount: 340.00, status: 'paid' },
    { id: '0039', date: new Date('2024-05-20'), amount: 125.50, status: 'paid' },
    { id: '0035', date: new Date('2024-02-10'), amount: 850.00, status: 'overdue' },
    { id: '0031', date: new Date('2024-01-05'), amount: 45.00, status: 'paid' },
  ];
  // -------------------------

  // TODO (backend): Replace all hardcoded data with API response from GET /customer/invoices/:invoiceId
  // Existing Data
  readonly invoiceNumber = 'INV-2024-0912';
  readonly invoiceDate = new Date('2024-06-15');
  readonly dueDate = new Date('2024-07-15');
  readonly vehicleLabel = 'Honda Civic 2018';
  readonly customerName = 'Sophia Clark';

  // TODO (backend): Fetch invoice line items from API response
  readonly items: InvoiceItem[] = [
    { item: 'Oil Change', quantity: 1, price: 50, tax: 5, total: 55 },
    { item: 'Brake Pad Replacement', quantity: 2, price: 75, tax: 7.5, total: 165 },
    { item: 'Tire Rotation', quantity: 4, price: 25, tax: 2.5, total: 110 },
  ];

  get subtotal(): number {
    return this.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  }

  get totalTax(): number {
    return this.items.reduce((sum, i) => sum + i.tax, 0);
  }

  get grandTotal(): number {
    return this.items.reduce((sum, i) => sum + i.total, 0);
  }

  // TODO (backend): Fetch payment details from API response
  readonly paymentMethod = 'Credit Card';
  readonly amountPaid = 340;

  // TODO (backend): Implement download PDF functionality
  // GET /customer/invoices/:invoiceId/pdf - Download invoice as PDF
  downloadPdf(): void {
    // TODO (backend): Call API endpoint to generate/download PDF
    console.debug('[InvoiceOverview] Download PDF clicked');
  }

  // TODO (backend): Implement print invoice functionality
  // Option 1: Use browser print with invoice data
  // Option 2: GET /customer/invoices/:invoiceId/print - Generate print-ready version
  printInvoice(): void {
    // TODO (backend): Trigger print dialog or call print API endpoint
    console.debug('[InvoiceOverview] Print Invoice clicked');
  }
}
