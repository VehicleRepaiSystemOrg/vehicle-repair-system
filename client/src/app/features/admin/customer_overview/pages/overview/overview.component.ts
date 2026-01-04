import { Component, inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CustomerService, Customer } from '../../services/customer.service';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit, OnDestroy {
  readonly customerService = inject(CustomerService);
  private subscription?: Subscription;

  customers = signal<Customer[]>([]);

  // Search functionality
  searchQuery = signal<string>('');

  // Filtered customers based on search
  filteredCustomers = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) {
      return this.customers();
    }
    return this.customers().filter(customer =>
      customer.name.toLowerCase().includes(query) ||
      customer.email.toLowerCase().includes(query) ||
      customer.phone.toLowerCase().includes(query) ||
      customer.vehicles.some(vehicle =>
        vehicle.name.toLowerCase().includes(query) ||
        vehicle.numberPlate.toLowerCase().includes(query)
      )
    );
  });

  ngOnInit(): void {
    this.subscription = this.customerService.allCustomers$.subscribe(customers => {
      this.customers.set(customers);
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  onSearchChange(query: string): void {
    this.searchQuery.set(query);
  }
}
