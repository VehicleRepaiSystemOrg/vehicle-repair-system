import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // 1. Import FormsModule
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CustomerService, Customer } from '../../services/customer.service';

@Component({
  selector: 'app-edit-customer',
  standalone: true, // 2. Ensure standalone is true
  imports: [
    CommonModule, 
    FormsModule,  // 3. Add FormsModule here
    RouterModule
  ],
  templateUrl: './edit-customer.component.html',
  styleUrls: ['./edit-customer.component.scss']
})
export class EditCustomerComponent implements OnInit {
  customer: Customer = {} as Customer;
  private readonly customerService = inject(CustomerService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  ngOnInit() {
    // Get ID from URL and fetch customer data
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const found = this.customerService.getCustomerById(id);
    if (found) {
      this.customer = { ...found }; // Create a copy to edit
    }
  }

  save() {
    this.customerService.updateCustomer(this.customer);
    this.router.navigate(['/customer_overview']);
  }

  onRemove() {
    this.customerService.removeCustomer(this.customer.id);
    this.router.navigate(['/customer_overview']);
  }
}