import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <--- 1. Import this
import { Router, RouterModule } from '@angular/router';
import { CustomerService, Customer } from '../../services/customer.service';

interface CustomerForm {
  name: string;
  vehicle: string;
  numberPlate: string;
  phone: string;
  email: string;
}

@Component({
  selector: 'app-add-customer',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,     // <--- 2. Add this here
    RouterModule
  ],
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.scss']
})
export class AddCustomerComponent {
  customer: CustomerForm = { name: '', vehicle: '', numberPlate: '', phone: '', email: '' };
  private readonly customerService = inject(CustomerService);
  private readonly router = inject(Router);

  save() {
    this.customerService.addCustomer(this.customer as Customer);
    this.router.navigate(['/customer_overview']);
  }
}