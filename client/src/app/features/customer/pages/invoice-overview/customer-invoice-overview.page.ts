import { ChangeDetectionStrategy, Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { InvoiceService } from '../../../../core/services/invoice.service';

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
export class CustomerInvoiceOverviewPageComponent implements OnInit, OnDestroy {
  
  private route = inject(ActivatedRoute);
  private invoiceService = inject(InvoiceService);
  private subscription?: Subscription;
  
  // TODO: Get customer name from auth service or route
  // For now, using a default customer name - replace with actual customer name from auth
  private readonly customerNameForHistory = 'Sophia Clark'; // This should come from authentication

  // --- Mock Database (fallback) ---
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
  invoiceHistory: InvoiceHistoryItem[] = [
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
    // Load invoice history on init
    this.loadInvoiceHistory();
    
    // Subscribe to invoice service updates
    this.subscription = this.invoiceService.allInvoices$.subscribe(() => {
      this.loadInvoiceHistory();
      // If we have a current invoice ID, reload it to get updates
      if (this.currentInvoiceId) {
        this.loadInvoice(this.currentInvoiceId);
      }
    });
    
    // Listen to URL changes
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadInvoice(id);
      } else {
        // If no ID, show the most recent invoice or default
        this.loadMostRecentInvoice();
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  loadInvoice(id: string) {
    // Try to load from invoice service first
    const invoiceData = this.invoiceService.getInvoiceById(id);
    
    if (invoiceData) {
      // Load from service
      this.currentInvoiceId = invoiceData.id;
      this.customerName = invoiceData.customerName;
      this.vehicleLabel = invoiceData.vehicleLabel;
      this.invoiceDate = invoiceData.invoiceDate;
      this.dueDate = invoiceData.dueDate;
      this.status = invoiceData.status;
      this.items = invoiceData.items;
      this.paymentMethod = invoiceData.paymentMethod;
      this.amountPaid = invoiceData.amountPaid;
      
      // Update invoice history from service
      this.updateInvoiceHistory();
    } else if (this.invoiceDatabase[id]) {
      // Fallback to mock database
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
    } else {
      // Default fallback
      this.loadInvoice('0042');
    }
  }

  private loadInvoiceHistory(): void {
    // Use customer name from loaded invoice if available, otherwise use default
    const customerName = this.customerName || this.customerNameForHistory;
    
    // Get all invoices and filter by customer name to catch any that might not be in history
    const allInvoices = this.invoiceService.getAllInvoices();
    const customerInvoices = allInvoices.filter(
      inv => inv.customerName.toLowerCase() === customerName.toLowerCase()
    );
    
    // Convert to history items
    const allCustomerHistory: InvoiceHistoryItem[] = customerInvoices.map(inv => ({
      id: inv.id,
      date: inv.invoiceDate,
      amount: inv.items.reduce((sum, item) => sum + item.total, 0),
      status: inv.status
    }));
    
    // Merge with existing mock history, avoiding duplicates
    const existingIds = new Set(this.invoiceHistory.map(h => h.id));
    const newHistory = allCustomerHistory.filter(h => !existingIds.has(h.id));
    
    if (newHistory.length > 0) {
      this.invoiceHistory.push(...newHistory);
      // Sort by date descending
      this.invoiceHistory.sort((a, b) => b.date.getTime() - a.date.getTime());
    } else if (allCustomerHistory.length > 0) {
      // If all service history items already exist, just update the list
      this.invoiceHistory = [...allCustomerHistory];
      this.invoiceHistory.sort((a, b) => b.date.getTime() - a.date.getTime());
    }
  }

  private loadMostRecentInvoice(): void {
    // Try to load the most recent invoice from history
    if (this.invoiceHistory.length > 0) {
      this.loadInvoice(this.invoiceHistory[0].id);
    } else {
      // Fallback to default
      this.loadInvoice('0042');
    }
  }

  private updateInvoiceHistory(): void {
    // Refresh invoice history
    this.loadInvoiceHistory();
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