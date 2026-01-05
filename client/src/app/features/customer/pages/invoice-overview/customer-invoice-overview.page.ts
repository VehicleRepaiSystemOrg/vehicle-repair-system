import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

// --- Interfaces ---
interface InvoiceHistoryItem {
  id: string;
  date: Date;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
}

interface InvoiceItem {
  item: string;
  quantity: number;
  price: number;
  tax: number;
  total: number;
}

interface InvoiceDetails {
  id: string;
  customerName: string;
  vehicleLabel: string;
  invoiceDate: Date;
  dueDate: Date;
  status: 'paid' | 'pending' | 'overdue';
  items: InvoiceItem[];
  paymentMethod: string;
  amountPaid: number;
}

@Component({
  standalone: true,
  selector: 'app-customer-invoice-overview-page',
  imports: [RouterLink, CommonModule],
  templateUrl: './customer-invoice-overview.page.html',
  styleUrl: './customer-invoice-overview.page.scss',
  changeDetection: ChangeDetectionStrategy.Default, // Changed to Default for easier updates
})
export class CustomerInvoiceOverviewPageComponent implements OnInit {
  
  private route = inject(ActivatedRoute);

  // --- Mock Database ---
  private readonly invoiceDatabase: Record<string, InvoiceDetails> = {
    '0042': {
      id: '0042',
      customerName: 'Sophia Clark',
      vehicleLabel: 'Honda Civic 2018',
      invoiceDate: new Date('2024-06-15'),
      dueDate: new Date('2024-07-15'),
      status: 'paid',
      paymentMethod: 'Credit Card',
      amountPaid: 340,
      items: [
        { item: 'Oil Change', quantity: 1, price: 50, tax: 5, total: 55 },
        { item: 'Brake Pad Replacement', quantity: 2, price: 75, tax: 7.5, total: 165 },
        { item: 'Tire Rotation', quantity: 4, price: 25, tax: 2.5, total: 110 },
      ]
    },
    '0039': {
      id: '0039',
      customerName: 'Sophia Clark',
      vehicleLabel: 'Honda Civic 2018',
      invoiceDate: new Date('2024-05-20'),
      dueDate: new Date('2024-06-20'),
      status: 'paid',
      paymentMethod: 'Cash',
      amountPaid: 126,
      items: [
        { item: 'Air Filter', quantity: 1, price: 30, tax: 3, total: 33 },
        { item: 'Wiper Blades', quantity: 2, price: 15, tax: 1.5, total: 33 },
        { item: 'Inspection', quantity: 1, price: 60, tax: 0, total: 60 }
      ]
    },
    '0035': {
      id: '0035',
      customerName: 'Sophia Clark',
      vehicleLabel: 'Honda Civic 2018',
      invoiceDate: new Date('2024-02-10'),
      dueDate: new Date('2024-03-10'),
      status: 'overdue',
      paymentMethod: 'Pending',
      amountPaid: 0,
      items: [
        { item: 'Engine Repair', quantity: 1, price: 800, tax: 50, total: 850 }
      ]
    },
    '0031': {
      id: '0031',
      customerName: 'Sophia Clark',
      vehicleLabel: 'Honda Civic 2018',
      invoiceDate: new Date('2024-01-05'),
      dueDate: new Date('2024-02-05'),
      status: 'paid',
      paymentMethod: 'Credit Card',
      amountPaid: 45,
      items: [
        { item: 'Car Wash', quantity: 1, price: 40, tax: 5, total: 45 }
      ]
    }
  };

  // --- Sidebar List ---
  readonly invoiceHistory: InvoiceHistoryItem[] = [
    { id: '0042', date: new Date('2024-06-15'), amount: 340.00, status: 'paid' },
    { id: '0039', date: new Date('2024-05-20'), amount: 126.00, status: 'paid' },
    { id: '0035', date: new Date('2024-02-10'), amount: 850.00, status: 'overdue' },
    { id: '0031', date: new Date('2024-01-05'), amount: 45.00, status: 'paid' },
  ];

  // --- Current View Data (Mutable) ---
  currentInvoiceId = '';
  customerName = '';
  vehicleLabel = '';
  invoiceDate: Date = new Date();
  dueDate: Date = new Date();
  status: 'paid' | 'pending' | 'overdue' = 'pending';
  items: InvoiceItem[] = [];
  paymentMethod = '';
  amountPaid = 0;

  ngOnInit(): void {
    // Listen to URL changes
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id && this.invoiceDatabase[id]) {
        this.loadInvoice(id);
      } else {
        // Fallback if ID is missing or invalid
        this.loadInvoice('0042');
      }
    });
  }

  loadInvoice(id: string) {
    const data = this.invoiceDatabase[id];
    this.currentInvoiceId = data.id;
    this.customerName = data.customerName;
    this.vehicleLabel = data.vehicleLabel;
    this.invoiceDate = data.invoiceDate;
    this.dueDate = data.dueDate;
    this.status = data.status;
    this.items = data.items;
    this.paymentMethod = data.paymentMethod;
    this.amountPaid = data.amountPaid;
  }

  get subtotal(): number {
    return this.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  }

  get totalTax(): number {
    return this.items.reduce((sum, i) => sum + i.tax, 0);
  }

  get grandTotal(): number {
    return this.items.reduce((sum, i) => sum + i.total, 0);
  }

  downloadPdf(): void {
    console.log('Downloading PDF...');
  }

  printInvoice(): void {
    window.print();
  }
}