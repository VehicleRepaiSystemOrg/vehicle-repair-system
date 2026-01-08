import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { WarrantyService, WarrantyItem } from '../../../../../core/services/warranty.service';
import { CustomerService } from '../../services/customer.service';

interface Payment {
  id: number;
  serviceId: number;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  status: 'Paid' | 'Pending' | 'Failed';
}

interface Service {
  id: number;
  serviceType: string;
  date: string;
  time: string;
  status: 'Pickup';
  tags: string[];
  description: string;
  numberPlate: string;
  customerName: string;
}

interface Vehicle {
  name: string;
  numberPlate: string;
}

interface Customer {
  id: number;
  name: string;
  phone: string;
  email: string;
  vehicles: Vehicle[];
}

@Component({
  selector: 'app-view-customer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './view-customer.component.html',
  styleUrls: ['./view-customer.component.scss']
})
export class ViewCustomerComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly warrantyService = inject(WarrantyService);
  private readonly customerService = inject(CustomerService);
  private subscriptions = new Subscription();

  customer: Customer | null = null;
  selectedVehicle = signal<string>('');
  startDate = signal<string>('');
  endDate = signal<string>('');

  // Warranty management
  customerWarrantyItems = signal<WarrantyItem[]>([]);
  showWarrantySection = signal<boolean>(true); // Show by default

  // Mock data
  private mockCustomers: Customer[] = [
    {
      id: 1,
      name: 'John Doe',
      phone: '+1-555-0123',
      email: 'john.doe@email.com',
      vehicles: [
        { name: 'Toyota Camry', numberPlate: 'ABC-123' },
        { name: 'Honda Civic', numberPlate: 'XYZ-789' }
      ]
    },
    {
      id: 2,
      name: 'Jane Smith',
      phone: '+1-555-0456',
      email: 'jane.smith@email.com',
      vehicles: [
        { name: 'Ford Mustang', numberPlate: 'DEF-456' }
      ]
    }
  ];

  private mockServices: Service[] = [
    {
      id: 1,
      serviceType: 'Oil Change',
      date: '2024-01-15',
      time: '10:00 AM',
      status: 'Pickup',
      tags: ['Maintenance', 'Engine'],
      description: 'Complete oil change with filter replacement',
      numberPlate: 'ABC-123',
      customerName: 'John Doe'
    },
    {
      id: 2,
      serviceType: 'Brake Inspection',
      date: '2024-01-20',
      time: '2:00 PM',
      status: 'Pickup',
      tags: ['Safety', 'Brakes'],
      description: 'Full brake system inspection and pad replacement',
      numberPlate: 'ABC-123',
      customerName: 'John Doe'
    },
    {
      id: 3,
      serviceType: 'Tire Rotation',
      date: '2024-02-01',
      time: '11:00 AM',
      status: 'Pickup',
      tags: ['Maintenance', 'Tires'],
      description: 'Tire rotation and pressure check',
      numberPlate: 'XYZ-789',
      customerName: 'John Doe'
    },
    {
      id: 4,
      serviceType: 'Engine Tune-up',
      date: '2024-02-10',
      time: '9:00 AM',
      status: 'Pickup',
      tags: ['Maintenance', 'Engine'],
      description: 'Complete engine tune-up and spark plug replacement',
      numberPlate: 'DEF-456',
      customerName: 'Jane Smith'
    }
  ];

  private mockPayments: Payment[] = [
    {
      id: 1,
      serviceId: 1,
      amount: 45.00,
      paymentDate: '2024-01-15',
      paymentMethod: 'Cash',
      status: 'Paid'
    },
    {
      id: 2,
      serviceId: 2,
      amount: 120.00,
      paymentDate: '2024-01-20',
      paymentMethod: 'Card',
      status: 'Paid'
    },
    {
      id: 3,
      serviceId: 3,
      amount: 25.00,
      paymentDate: '2024-02-01',
      paymentMethod: 'Cash',
      status: 'Paid'
    },
    {
      id: 4,
      serviceId: 4,
      amount: 180.00,
      paymentDate: '2024-02-10',
      paymentMethod: 'Bank Transfer',
      status: 'Paid'
    }
  ];

  ngOnInit(): void {
    // Get customer ID from route
    const id = Number(this.route.snapshot.paramMap.get('id'));
    
    // Load customer from CustomerService (not mock data)
    const foundCustomer = this.customerService.getCustomerById(id);
    if (foundCustomer) {
      // Convert CustomerService customer to view component customer format
      this.customer = {
        id: foundCustomer.id,
        name: foundCustomer.name,
        phone: foundCustomer.phone,
        email: foundCustomer.email,
        vehicles: foundCustomer.vehicles
      };
    } else {
      // Fallback to mock data if not found in CustomerService
      this.customer = this.mockCustomers.find(c => c.id === id) || null;
    }

    if (this.customer && this.customer.vehicles.length > 0) {
      this.selectedVehicle.set(this.customer.vehicles[0].numberPlate);
    }

    // Load customer warranty items
    if (this.customer) {
      // Subscribe to warranty items changes
      const warrantySub = this.warrantyService.allWarrantyItems$.subscribe(() => {
        // Refresh statuses first
        this.warrantyService.refreshWarrantyStatuses();
        
        // Get updated items after refresh
        const allItems = this.warrantyService.getAllWarrantyItems();
        const customerItems = allItems.filter(item => item.customerId === this.customer!.id);
        this.customerWarrantyItems.set(customerItems);
        
        // Auto-show warranty section if there are items
        if (customerItems.length > 0) {
          this.showWarrantySection.set(true);
        }
      });
      this.subscriptions.add(warrantySub);
      
      // Initial load
      this.loadCustomerWarrantyItems();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  goBack(): void {
    this.router.navigate(['/customer_overview']);
  }

  selectVehicle(vehicleNumberPlate: string): void {
    this.selectedVehicle.set(vehicleNumberPlate);
  }

  getFilteredServices(): Service[] {
    if (!this.customer) return [];

    let services = this.mockServices.filter(service =>
      service.customerName === this.customer!.name &&
      service.numberPlate === this.selectedVehicle() &&
      service.status === 'Pickup'
    );

    // Apply date filtering
    if (this.startDate()) {
      services = services.filter(service => service.date >= this.startDate());
    }
    if (this.endDate()) {
      services = services.filter(service => service.date <= this.endDate());
    }

    return services;
  }

  getPaymentsForService(serviceId: number): Payment[] {
    return this.mockPayments.filter(payment => payment.serviceId === serviceId);
  }

  get selectedVehicleName(): string {
    if (!this.customer) return '';
    const vehicle = this.customer.vehicles.find(v => v.numberPlate === this.selectedVehicle());
    return vehicle ? vehicle.name : '';
  }

  clearDateFilters(): void {
    this.startDate.set('');
    this.endDate.set('');
  }

  toggleWarrantySection(): void {
    this.showWarrantySection.update(val => !val);
  }

  removeWarrantyItem(warrantyItemId: number): void {
    if (confirm('Are you sure you want to remove this warranty item?')) {
      this.warrantyService.removeWarrantyItem(warrantyItemId);
      if (this.customer) {
        const updatedItems = this.warrantyService.getWarrantyItemsByCustomerId(this.customer.id);
        this.customerWarrantyItems.set(updatedItems);
      }
    }
  }

  formatWarranty(months: number, years: number): string {
    if (years === 0 && months === 0) {
      return 'No Warranty';
    }
    const parts: string[] = [];
    if (years > 0) {
      parts.push(`${years} year${years > 1 ? 's' : ''}`);
    }
    if (months > 0) {
      parts.push(`${months} month${months > 1 ? 's' : ''}`);
    }
    return parts.join(' ');
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
  }

  /**
   * Load warranty items for the current customer
   */
  private loadCustomerWarrantyItems(): void {
    if (!this.customer) return;
    
    // Refresh warranty statuses first
    this.warrantyService.refreshWarrantyStatuses();
    
    // Get all warranty items and filter by customer ID
    const allItems = this.warrantyService.getAllWarrantyItems();
    const customerItems = allItems.filter(item => item.customerId === this.customer!.id);
    this.customerWarrantyItems.set(customerItems);
    
    // Auto-show warranty section if there are items
    if (customerItems.length > 0) {
      this.showWarrantySection.set(true);
    }
  }
}