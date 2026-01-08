import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ServiceService, Service, ServiceStatus, AssignedStaff } from '../../services/service.service';
import { CustomerService, Customer } from '../../../customer_overview/services/customer.service';
import { StaffService, StaffMember } from '../../../staff/services/staff.service';
import { AppointmentService } from '../../../../../core/services/appointment.service';

/**
 * Add Service Component
 * Allows admin to search for a customer and add a new service
 * Includes tag management for "main things done" and staff assignment
 */
@Component({
  selector: 'app-add-service',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-service.component.html',
  styleUrls: ['./add-service.component.scss']
})
export class AddServiceComponent implements OnInit {
  private readonly serviceService = inject(ServiceService);
  private readonly customerService = inject(CustomerService);
  private readonly staffService = inject(StaffService);
  private readonly appointmentService = inject(AppointmentService);
  private readonly router = inject(Router);

  // Customer type toggle
  isRegisteredCustomer = signal<boolean>(true);

  // Customer search (for registered)
  customerSearchQuery = signal<string>('');
  customers = signal<Customer[]>([]);
  filteredCustomers = computed(() => {
    const query = this.customerSearchQuery().toLowerCase().trim();
    if (!query) {
      return [];
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
  selectedCustomer = signal<Customer | null>(null);

  // Unregistered customer details
  unregisteredCustomerName = signal<string>('');
  unregisteredVehicle = signal<string>('');
  unregisteredNumberPlate = signal<string>('');
  unregisteredPhone = signal<string>('');
  unregisteredEmail = signal<string>('');

  // Service form
  serviceForm = signal({
    serviceType: '',
    date: new Date().toISOString().split('T')[0],
    time: '12:00 PM',
    description: '',
    status: 'Pending' as ServiceStatus
  });

  // Tags management
  tags = signal<string[]>([]);
  tagInput = signal<string>('');

  // Staff management
  availableStaff = signal<StaffMember[]>([]);
  assignedStaff = signal<AssignedStaff[]>([]);
  showStaffDropdown = signal<boolean>(false);

  // Service status options
  statuses: ServiceStatus[] = [
    'Pending',
    'Inspection',
    'Estimate Approved',
    'In Progress',
    'Quality Check',
    'Pickup'
  ];

  ngOnInit(): void {
    // Load all customers for search
    // TODO (backend): Load customers from API
    this.customerService.allCustomers$.subscribe(customers => {
      this.customers.set(customers);
    });

    // Load all staff members
    this.staffService.staff$.subscribe(staff => {
      this.availableStaff.set(staff.filter(s => s.status === 'Active'));
    });
  }

  /**
   * Toggle between registered and unregistered customer
   */
  toggleCustomerType(isRegistered: boolean): void {
    this.isRegisteredCustomer.set(isRegistered);
    // Clear selections when switching
    this.selectedCustomer.set(null);
    this.customerSearchQuery.set('');
    this.unregisteredCustomerName.set('');
    this.unregisteredVehicle.set('');
    this.unregisteredNumberPlate.set('');
    this.unregisteredPhone.set('');
    this.unregisteredEmail.set('');
  }

  /**
   * Handle customer search input
   */
  onCustomerSearch(query: string): void {
    this.customerSearchQuery.set(query);
  }

  /**
   * Select a customer from search results
   */
  selectCustomer(customer: Customer): void {
    this.selectedCustomer.set(customer);
    this.customerSearchQuery.set('');
  }

  /**
   * Clear selected customer
   */
  clearCustomer(): void {
    this.selectedCustomer.set(null);
  }

  /**
   * Add a tag to the service
   */
  addTag(): void {
    const tag = this.tagInput().trim();
    if (tag && !this.tags().includes(tag)) {
      this.tags.update(tags => [...tags, tag]);
      this.tagInput.set('');
    }
  }

  /**
   * Remove a tag
   */
  removeTag(tag: string): void {
    this.tags.update(tags => tags.filter(t => t !== tag));
  }

  /**
   * Handle tag input Enter key
   */
  onTagInputKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.addTag();
    }
  }

  /**
   * Assign a staff member to the service
   */
  assignStaff(staff: StaffMember): void {
    const assigned = this.assignedStaff();
    if (!assigned.find(s => s.id === staff.id)) {
      this.assignedStaff.update(s => [...s, { id: staff.id, name: staff.name, role: staff.role }]);
    }
    this.showStaffDropdown.set(false);
  }

  /**
   * Remove assigned staff member
   */
  removeAssignedStaff(staffId: number): void {
    this.assignedStaff.update(s => s.filter(item => item.id !== staffId));
  }

  /**
   * Toggle staff dropdown visibility
   */
  toggleStaffDropdown(): void {
    this.showStaffDropdown.update(show => !show);
  }

  /**
   * Check if a staff member is already assigned
   */
  isStaffAlreadyAssigned(staffId: number): boolean {
    return this.assignedStaff().some((s: AssignedStaff) => s.id === staffId);
  }

  /**
   * Update service form field
   */
  updateFormField(field: 'serviceType' | 'date' | 'time' | 'description' | 'status', value: string): void {
    this.serviceForm.update(form => ({ ...form, [field]: value }));
  }

  /**
   * Save the new service
   */
  saveService(): void {
    const form = this.serviceForm();
    const isRegistered = this.isRegisteredCustomer();

    let customerId: number | undefined;
    let customerName: string;
    let vehicle: string;
    let numberPlate: string;

    if (isRegistered) {
      const customer = this.selectedCustomer();
      if (!customer) {
        alert('Please select a customer first');
        return;
      }
      if (customer.vehicles.length === 0) {
        alert('Selected customer has no vehicles');
        return;
      }
      customerId = customer.id;
      customerName = customer.name;
      // Use the first vehicle for now - could be enhanced to allow selection
      vehicle = customer.vehicles[0].name;
      numberPlate = customer.vehicles[0].numberPlate;
    } else {
      customerName = this.unregisteredCustomerName().trim();
      vehicle = this.unregisteredVehicle().trim();
      numberPlate = this.unregisteredNumberPlate().trim();

      if (!customerName) {
        alert('Please enter customer name');
        return;
      }
      if (!vehicle) {
        alert('Please enter vehicle details');
        return;
      }
      if (!numberPlate) {
        alert('Please enter number plate');
        return;
      }
    }

    if (!form.serviceType.trim()) {
      alert('Please enter a service type');
      return;
    }

    const newService: Partial<Service> = {
      customerId,
      customerName,
      vehicle,
      numberPlate,
      serviceType: form.serviceType,
      date: form.date,
      time: form.time,
      status: form.status,
      tags: this.tags(),
      assignedStaff: this.assignedStaff(),
      description: form.description || undefined
    };

    // TODO (backend): Add loading state and error handling
    this.serviceService.addService(newService);
    
    // Also create an appointment for the calendar
    // Format time to AM/PM if needed
    let timeDisplay = form.time;
    if (!timeDisplay.includes('AM') && !timeDisplay.includes('PM')) {
      const [hours, minutes] = timeDisplay.split(':');
      const hour = parseInt(hours, 10);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour % 12 || 12;
      timeDisplay = `${hour12}:${minutes || '00'} ${ampm}`;
    }
    
    this.appointmentService.createAppointment({
      customerId,
      customerName,
      vehicle,
      numberPlate,
      service: form.serviceType,
      date: form.date,
      time: timeDisplay,
      status: 'Scheduled',
      notes: form.description || undefined
    });
    
    // Navigate back to service management
    this.router.navigate(['/service_management']);
  }

  /**
   * Cancel and go back
   */
  cancel(): void {
    this.router.navigate(['/service_management']);
  }
}

