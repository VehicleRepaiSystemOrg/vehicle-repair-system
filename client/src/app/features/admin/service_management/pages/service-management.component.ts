import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ServiceService, Service } from '../services/service.service';
import { CustomerService } from '../../customer_overview/services/customer.service';

/**
 * Service Management Component
 * Main page for managing repair services
 * Allows admin to search customers and manage their services
 */
@Component({
  selector: 'app-service-management',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './service-management.component.html',
  styleUrls: ['./service-management.component.scss']
})
export class ServiceManagementComponent implements OnInit, OnDestroy {
  private readonly serviceService = inject(ServiceService);
  private readonly customerService = inject(CustomerService);
  private serviceSubscription?: Subscription;

  // Search functionality
  searchQuery = signal<string>('');
  
  // Services data
  services = signal<Service[]>([]);
  
  // Computed filtered services based on search
  filteredServices = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) {
      return this.services();
    }
    return this.services().filter(service =>
      service.customerName.toLowerCase().includes(query) ||
      service.vehicle.toLowerCase().includes(query) ||
      service.numberPlate.toLowerCase().includes(query) ||
      service.serviceType.toLowerCase().includes(query)
    );
  });

  ngOnInit(): void {
    // TODO (backend): Handle loading state and errors
    this.serviceSubscription = this.serviceService.allServices$.subscribe(services => {
      this.services.set(services);
    });
  }

  ngOnDestroy(): void {
    this.serviceSubscription?.unsubscribe();
  }

  /**
   * Handle search input changes
   */
  onSearchChange(query: string): void {
    this.searchQuery.set(query);
  }

  /**
   * Delete a service
   */
  onDeleteService(serviceId: number): void {
    if (confirm('Are you sure you want to delete this service?')) {
      // TODO (backend): Add loading state and error handling
      this.serviceService.removeService(serviceId);
      // The observable will automatically update via subscription
    }
  }

  /**
   * Get status badge class for styling
   */
  getStatusClass(status: string): string {
    const statusMap: Record<string, string> = {
      'Pending': 'status-pending',
      'Inspection': 'status-inspection',
      'Estimate Approved': 'status-approved',
      'In Progress': 'status-progress',
      'Quality Check': 'status-quality',
      'Pickup': 'status-pickup'
    };
    return statusMap[status] || 'status-default';
  }
}

