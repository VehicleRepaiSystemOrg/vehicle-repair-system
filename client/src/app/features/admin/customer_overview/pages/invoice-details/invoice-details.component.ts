import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

export interface Service {
  name: string;
  qty: number;
  price: number;
  tax: number;
  total: number;
}

export interface Invoice {
  date: string;
  dueDate?: string;
  vehicle: string;
  customer: string;
  paymentMethod: string;
  amountPaid: number;
}

@Component({
  selector: 'app-invoice-details',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './invoice-details.component.html',
  styleUrls: ['./invoice-details.component.scss']
})
export class InvoiceDetailsComponent implements OnInit {
  private invoiceId: string | null = null;

  constructor() {
    this.route.params.subscribe(params => {
      this.invoiceId = params['id'];
    });
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
  private route = inject(ActivatedRoute);
  isEditMode = false;

  invoice: Invoice = {
    // Use the YYYY-MM-DD format so the calendar picker can load it correctly
    date: '2024-06-15',
    dueDate: '2024-07-15',
    vehicle: 'Honda Civic 2018',
    customer: 'Sophia Clark',
    paymentMethod: 'Credit Card',
    amountPaid: 340.0
  };

  services: Service[] = [
    { name: 'Oil Change', qty: 1, price: 50, tax: 5, total: 55 },
    { name: 'Brake Pad Replacement', qty: 2, price: 75, tax: 7.5, total: 165 },
    { name: 'Tire Rotation', qty: 4, price: 25, tax: 2.5, total: 110 }
  ];


  toggleEdit() {
    this.isEditMode = !this.isEditMode;
  }

  // --- NEW METHODS ---
  
  addService() {
    this.services.push({ name: '', qty: 1, price: 0, tax: 0, total: 0 });
  }

  removeService(index: number) {
    this.services.splice(index, 1);
  }

  // Helper to update individual row total during editing
  updateRowTotal(s: Service) {
    s.total = (s.price * s.qty) + s.tax;
  }

  get subtotal(): number { return this.services.reduce((sum, s) => sum + (s.price * s.qty), 0); }
  get totalTax(): number { return this.services.reduce((sum, s) => sum + s.tax, 0); }
  get grandTotal(): number { return this.services.reduce((sum, s) => sum + s.total, 0); }
}