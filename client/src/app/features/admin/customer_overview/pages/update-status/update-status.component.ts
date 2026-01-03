import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { CustomerService, Customer } from '../../services/customer.service';

@Component({
  selector: 'app-update-status',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink,
    FormsModule 
  ],
  templateUrl: './update-status.component.html',
  styleUrls: ['./update-status.component.scss']
})
export class UpdateStatusComponent implements OnInit {
  // Dependency Injection
  private customerService = inject(CustomerService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // Status Tracking Properties
  customerId: string | null = null;
  customer: Customer = {} as Customer;
  statuses = ['Pending', 'Inspection', 'Estimate Approved', 'In Progress', 'Quality Check', 'Pickup'];

  // Scheduling Properties
  nextSessionDate = '';

  ngOnInit() {
    // Get the ID from the URL
    this.customerId = this.route.snapshot.paramMap.get('id');

    // Fetch customer data if ID exists
    if (this.customerId) {
      const idAsNumber = +this.customerId;
      const found = this.customerService.getCustomerById(idAsNumber);
      if (found) {
        this.customer = { ...found };
      }
    }
  }

  // --- Status Logic ---
  setStatus(status: string) {
    this.customer.status = status;
    this.customerService.updateCustomer(this.customer);
    this.router.navigate(['/customer_overview']);
  }

  getProgress() {
    if (!this.customer.status) return 0;
    const index = this.statuses.indexOf(this.customer.status);
    return ((index + 1) / this.statuses.length) * 100;
  }

  isReached(status: string) {
    const currentIndex = this.statuses.indexOf(this.customer.status);
    const statusIndex = this.statuses.indexOf(status);
    return statusIndex <= currentIndex;
  }

  // --- Scheduling Logic ---
  saveSchedule() {
    console.log('Saving schedule:', this.nextSessionDate);
    alert('Next session saved for: ' + this.nextSessionDate);
    
    // Optional: If you want to save this to the customer object
    // this.customer.nextSession = this.nextSessionDate;
    // this.customerService.updateCustomer(this.customer);
  }
}