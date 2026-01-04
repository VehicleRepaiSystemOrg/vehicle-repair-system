import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

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
export class ViewCustomerComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  customer: Customer | null = null;
  selectedVehicle = signal<string>('');
  startDate = signal<string>('');
  endDate = signal<string>('');

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
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.customer = this.mockCustomers.find(c => c.id === id) || null;

    if (this.customer && this.customer.vehicles.length > 0) {
      this.selectedVehicle.set(this.customer.vehicles[0].numberPlate);
    }
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
}