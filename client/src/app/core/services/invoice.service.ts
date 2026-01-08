import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface InvoiceItem {
  item: string;
  quantity: number;
  price: number;
  tax: number;
  total: number;
}

export interface InvoiceDetails {
  id: string;
  serviceId: number;
  customerName: string;
  vehicleLabel: string;
  invoiceDate: Date;
  dueDate: Date;
  status: 'paid' | 'pending' | 'overdue';
  items: InvoiceItem[];
  paymentMethod: string;
  amountPaid: number;
}

export interface InvoiceHistoryItem {
  id: string;
  date: Date;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
}

@Injectable({ providedIn: 'root' })
export class InvoiceService {
  private invoices$ = new BehaviorSubject<InvoiceDetails[]>([]);

  // Public observable
  allInvoices$: Observable<InvoiceDetails[]> = this.invoices$.asObservable();

  constructor() {
    // Initialize with empty array
  }

  /**
   * Create an invoice from a service
   */
  createInvoiceFromService(
    serviceId: number,
    customerName: string,
    vehicleLabel: string,
    serviceType: string,
    serviceDate: string,
    items?: InvoiceItem[]
  ): string {
    const invoiceId = this.generateInvoiceId();
    const invoiceDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30); // 30 days from invoice date

    // Default items if not provided
    const invoiceItems: InvoiceItem[] = items || [
      {
        item: serviceType || 'Service',
        quantity: 1,
        price: 0,
        tax: 0,
        total: 0
      }
    ];

    const newInvoice: InvoiceDetails = {
      id: invoiceId,
      serviceId,
      customerName,
      vehicleLabel,
      invoiceDate,
      dueDate,
      status: 'pending',
      items: invoiceItems,
      paymentMethod: 'Pending',
      amountPaid: 0
    };

    const current = this.invoices$.value;
    this.invoices$.next([...current, newInvoice]);

    return invoiceId;
  }

  /**
   * Get invoice by ID
   */
  getInvoiceById(id: string): InvoiceDetails | undefined {
    return this.invoices$.value.find(inv => inv.id === id);
  }

  /**
   * Get invoices by service ID
   */
  getInvoicesByServiceId(serviceId: number): InvoiceDetails[] {
    return this.invoices$.value.filter(inv => inv.serviceId === serviceId);
  }

  /**
   * Get invoices by customer name
   */
  getInvoicesByCustomerName(customerName: string): InvoiceDetails[] {
    return this.invoices$.value.filter(
      inv => inv.customerName.toLowerCase() === customerName.toLowerCase()
    );
  }

  /**
   * Get all invoices
   */
  getAllInvoices(): InvoiceDetails[] {
    return this.invoices$.value;
  }

  /**
   * Get invoice history for a customer
   */
  getInvoiceHistory(customerName: string): InvoiceHistoryItem[] {
    const invoices = this.getInvoicesByCustomerName(customerName);
    return invoices.map(inv => ({
      id: inv.id,
      date: inv.invoiceDate,
      amount: inv.items.reduce((sum, item) => sum + item.total, 0),
      status: inv.status
    })).sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  /**
   * Update invoice
   */
  updateInvoice(updatedInvoice: InvoiceDetails): void {
    const current = this.invoices$.value.map(inv =>
      inv.id === updatedInvoice.id ? updatedInvoice : inv
    );
    this.invoices$.next(current);
  }

  /**
   * Generate a unique invoice ID
   */
  private generateInvoiceId(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return String(timestamp).slice(-6) + String(random).padStart(3, '0');
  }
}

