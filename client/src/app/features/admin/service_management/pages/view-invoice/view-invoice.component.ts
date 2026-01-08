import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { InvoiceService, InvoiceItem, InvoiceDetails } from '../../../../../core/services/invoice.service';

interface InvoiceHistoryItem {
  id: string;
  date: Date;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
}

@Component({
  selector: 'app-view-invoice',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './view-invoice.component.html',
  styleUrls: ['./view-invoice.component.scss']
})
export class ViewInvoiceComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly invoiceService = inject(InvoiceService);
  private subscription?: Subscription;

  // Current invoice data
  currentInvoiceId = '';
  customerName = '';
  vehicleLabel = '';
  invoiceDate: Date = new Date();
  dueDate: Date = new Date();
  status: 'paid' | 'pending' | 'overdue' = 'pending';
  items: InvoiceItem[] = [];
  paymentMethod = '';
  amountPaid = 0;

  // Invoice history for sidebar
  invoiceHistory: InvoiceHistoryItem[] = [];

  ngOnInit(): void {
    // Load invoice history
    this.loadInvoiceHistory();

    // Subscribe to invoice service updates
    this.subscription = this.invoiceService.allInvoices$.subscribe(() => {
      this.loadInvoiceHistory();
      if (this.currentInvoiceId) {
        this.loadInvoice(this.currentInvoiceId);
      }
    });

    // Listen to URL changes
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadInvoice(id);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  loadInvoice(id: string): void {
    const invoiceData = this.invoiceService.getInvoiceById(id);
    
    if (invoiceData) {
      this.currentInvoiceId = invoiceData.id;
      this.customerName = invoiceData.customerName;
      this.vehicleLabel = invoiceData.vehicleLabel;
      this.invoiceDate = invoiceData.invoiceDate;
      this.dueDate = invoiceData.dueDate;
      this.status = invoiceData.status;
      this.items = invoiceData.items;
      this.paymentMethod = invoiceData.paymentMethod;
      this.amountPaid = invoiceData.amountPaid;
      
      // Update invoice history
      this.loadInvoiceHistory();
    } else {
      alert('Invoice not found');
      this.router.navigate(['/service_management']);
    }
  }

  private loadInvoiceHistory(): void {
    if (!this.customerName) {
      // If no customer name yet, try to get from current invoice
      if (this.currentInvoiceId) {
        const invoice = this.invoiceService.getInvoiceById(this.currentInvoiceId);
        if (invoice) {
          this.customerName = invoice.customerName;
        }
      }
    }
    
    if (this.customerName) {
      const serviceHistory = this.invoiceService.getInvoiceHistory(this.customerName);
      this.invoiceHistory = serviceHistory;
    }
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
    // TODO: Implement PDF download
  }

  printInvoice(): void {
    window.print();
  }

  goBack(): void {
    this.router.navigate(['/service_management']);
  }
}

