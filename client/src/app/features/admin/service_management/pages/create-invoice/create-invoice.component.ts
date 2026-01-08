import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ServiceService, Service } from '../../services/service.service';
import { InvoiceService, InvoiceItem } from '../../../../../core/services/invoice.service';

@Component({
  selector: 'app-create-invoice',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-invoice.component.html',
  styleUrls: ['./create-invoice.component.scss']
})
export class CreateInvoiceComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly serviceService = inject(ServiceService);
  private readonly invoiceService = inject(InvoiceService);

  serviceId: number | null = null;
  service: Service | null = null;

  // Invoice items
  invoiceItems = signal<InvoiceItem[]>([
    { item: '', quantity: 1, price: 0, tax: 0, total: 0 }
  ]);

  // Invoice details
  invoiceDate = signal<string>(new Date().toISOString().split('T')[0]);
  dueDate = signal<string>('');

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.serviceId = +id;
      this.service = this.serviceService.getServiceById(this.serviceId) || null;
      
      if (this.service) {
        // Initialize with service type as first item
        this.invoiceItems.set([
          {
            item: this.service.serviceType || 'Service',
            quantity: 1,
            price: 0,
            tax: 0,
            total: 0
          }
        ]);

        // Set due date to 30 days from invoice date
        const due = new Date();
        due.setDate(due.getDate() + 30);
        this.dueDate.set(due.toISOString().split('T')[0]);
      } else {
        alert('Service not found');
        this.router.navigate(['/service_management']);
      }
    }
  }

  addInvoiceItem(): void {
    this.invoiceItems.update(items => [
      ...items,
      { item: '', quantity: 1, price: 0, tax: 0, total: 0 }
    ]);
  }

  removeInvoiceItem(index: number): void {
    if (this.invoiceItems().length > 1) {
      this.invoiceItems.update(items => items.filter((_, i) => i !== index));
    }
  }

  updateItem(index: number, field: keyof InvoiceItem, value: string | number): void {
    this.invoiceItems.update(items => {
      const updated = [...items];
      updated[index] = { ...updated[index], [field]: value };
      
      // Calculate total
      const quantity = updated[index].quantity;
      const price = updated[index].price;
      const tax = updated[index].tax;
      updated[index].total = (quantity * price) + tax;
      
      return updated;
    });
  }

  get subtotal(): number {
    return this.invoiceItems().reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  get totalTax(): number {
    return this.invoiceItems().reduce((sum, item) => sum + item.tax, 0);
  }

  get grandTotal(): number {
    return this.invoiceItems().reduce((sum, item) => sum + item.total, 0);
  }

  saveInvoice(): void {
    if (!this.service) {
      alert('Service not found');
      return;
    }

    // Validate invoice items
    const items = this.invoiceItems().filter(item => item.item.trim() !== '');
    if (items.length === 0) {
      alert('Please add at least one invoice item');
      return;
    }

    // Validate dates
    if (!this.invoiceDate() || !this.dueDate()) {
      alert('Please select invoice date and due date');
      return;
    }

    // Create invoice
    const vehicleLabel = `${this.service.vehicle} ${this.service.numberPlate ? `(${this.service.numberPlate})` : ''}`;
    const invoiceId = this.invoiceService.createInvoiceFromService(
      this.service.id,
      this.service.customerName,
      vehicleLabel,
      this.service.serviceType,
      this.service.date,
      items
    );

    // Update invoice with dates
    const invoice = this.invoiceService.getInvoiceById(invoiceId);
    if (invoice) {
      invoice.invoiceDate = new Date(this.invoiceDate());
      invoice.dueDate = new Date(this.dueDate());
      this.invoiceService.updateInvoice(invoice);
    }

    // Show success message
    alert('Invoice successfully created! The invoice has been saved and is now available to the customer.');
    
    // Navigate to admin invoice view page
    this.router.navigate(['/service_management/view-invoice', invoiceId]);
  }

  cancel(): void {
    this.router.navigate(['/service_management/edit', this.serviceId]);
  }
}

