import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <--- 1. Import this
import { Router, RouterModule } from '@angular/router';
import { CustomerService, Customer } from '../../services/customer.service';

interface VehicleForm {
  name: string;
  numberPlate: string;
}

interface CustomerForm {
  name: string;
  vehicles: VehicleForm[];
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
  customer: CustomerForm = { 
    name: '', 
    vehicles: [{ name: '', numberPlate: '' }], 
    phone: '', 
    email: '' 
  };
  private readonly customerService = inject(CustomerService);
  private readonly router = inject(Router);

  addVehicle(): void {
    this.customer.vehicles.push({ name: '', numberPlate: '' });
  }

  removeVehicle(index: number): void {
    if (this.customer.vehicles.length > 1) {
      this.customer.vehicles.splice(index, 1);
    }
  }

  save() {
    // Filter out empty vehicles
    const validVehicles = this.customer.vehicles.filter(v => v.name.trim() && v.numberPlate.trim());
    if (validVehicles.length === 0) {
      alert('Please add at least one vehicle');
      return;
    }

    const customerData: Partial<Customer> = {
      ...this.customer,
      vehicles: validVehicles
    };

    this.customerService.addCustomer(customerData);
    this.router.navigate(['/customer_overview']);
  }

  trackByIndex(index: number): number {
    return index;
  }

  goBack(): void {
    this.router.navigate(['/customer_overview']);
  }
}