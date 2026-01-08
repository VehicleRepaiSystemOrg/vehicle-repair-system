import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ServiceService, Service, ServiceStatus, AssignedStaff } from '../../services/service.service';
import { StaffService, StaffMember } from '../../../staff/services/staff.service';
import { InventoryService, InventoryItem } from '../../../inventory/services/inventory.service';
import { WarrantyService, WarrantyItem } from '../../../../../core/services/warranty.service';
import { CustomerService } from '../../../customer_overview/services/customer.service';
import { InvoiceService } from '../../../../../core/services/invoice.service';
import { AppointmentService } from '../../../../../core/services/appointment.service';

/**
 * Edit Service Component
 * Allows admin to manage service status and details
 * Includes status change with progress tracker, tag management, and staff assignments
 */
@Component({
  selector: 'app-edit-service',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './edit-service.component.html',
  styleUrls: ['./edit-service.component.scss']
})
export class EditServiceComponent implements OnInit, OnDestroy {
  private readonly serviceService = inject(ServiceService);
  private readonly staffService = inject(StaffService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly inventoryService = inject(InventoryService);
  private readonly warrantyService = inject(WarrantyService);
  private readonly customerService = inject(CustomerService);
  private readonly invoiceService = inject(InvoiceService);
  private readonly appointmentService = inject(AppointmentService);
  private subscriptions = new Subscription();

  serviceId: number | null = null;
  service = signal<Service | null>(null);

  // Status management
  statuses: ServiceStatus[] = [
    'Pending',
    'Inspection',
    'Estimate Approved',
    'In Progress',
    'Quality Check',
    'Pickup'
  ];

  // Form data
  serviceForm = signal({
    serviceType: '',
    date: '',
    time: '',
    status: 'Pending' as ServiceStatus,
    description: ''
  });

  // Tags management
  tags = signal<string[]>([]);
  tagInput = signal<string>('');

  // Staff management
  availableStaff = signal<StaffMember[]>([]);
  assignedStaff = signal<AssignedStaff[]>([]);
  showStaffDropdown = signal<boolean>(false);

  // Scheduling
  nextSessionDate = '';
  nextSessionTime = '10:00';
  nextSessionNotes = '';

  // Warranty items management
  inventoryItems = signal<InventoryItem[]>([]);
  selectedInventoryItemId = signal<number | null>(null);
  warrantyInstallDate = signal<string>('');
  addedWarrantyItems = signal<WarrantyItem[]>([]);
  showWarrantySection = signal<boolean>(false);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.serviceId = +id;
      const found = this.serviceService.getServiceById(this.serviceId);
      if (found) {
        this.service.set(found);
        this.serviceForm.set({
          serviceType: found.serviceType,
          date: found.date,
          time: found.time,
          status: found.status,
          description: found.description || ''
        });
        this.tags.set([...found.tags]);
        if (found.assignedStaff) {
          this.assignedStaff.set([...found.assignedStaff]);
        }
        
        // Load existing warranty items for this service
        const existingWarranties = this.warrantyService.getWarrantyItemsByServiceId(this.serviceId);
        this.addedWarrantyItems.set(existingWarranties);
      } else {
        // TODO (backend): Handle service not found
        alert('Service not found');
        this.router.navigate(['/service_management']);
      }
    }

    // Load all staff members
    this.staffService.staff$.subscribe(staff => {
      this.availableStaff.set(staff.filter(s => s.status === 'Active'));
    });

    // Load inventory items with warranty - subscribe to get real-time updates
    const inventorySub = this.inventoryService.parts$.subscribe(items => {
      // Filter items that have warranty (years > 0 OR months > 0)
      const itemsWithWarranty = items.filter(item => 
        item.warranty && (item.warranty.years > 0 || item.warranty.months > 0)
      );
      this.inventoryItems.set(itemsWithWarranty);
    });
    this.subscriptions.add(inventorySub);

    // Set default install date to today
    this.warrantyInstallDate.set(new Date().toISOString().split('T')[0]);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  /**
   * Update service status
   */
  setStatus(status: ServiceStatus): void {
    const currentService = this.service();
    if (currentService) {
      this.serviceForm.update(f => ({ ...f, status }));
      const updated: Service = {
        ...currentService,
        status,
        updatedAt: new Date().toISOString()
      };
      this.service.set(updated);
      // TODO (backend): Save to backend
      this.serviceService.updateServiceStatus(currentService.id, status);
    }
  }

  /**
   * Calculate progress percentage for progress bar
   */
  getProgress(): number {
    const status = this.serviceForm().status;
    if (!status) return 0;
    const index = this.statuses.indexOf(status);
    return ((index + 1) / this.statuses.length) * 100;
  }

  /**
   * Check if a status step has been reached
   */
  isReached(status: ServiceStatus): boolean {
    const currentStatus = this.serviceForm().status;
    if (!currentStatus) return false;
    const currentIndex = this.statuses.indexOf(currentStatus);
    const statusIndex = this.statuses.indexOf(status);
    return statusIndex <= currentIndex;
  }

  /**
   * Add a tag
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
   * Save all changes to the service
   */
  saveChanges(): void {
    const currentService = this.service();
    if (!currentService) return;

    const form = this.serviceForm();
    const updated: Service = {
      ...currentService,
      serviceType: form.serviceType,
      date: form.date,
      time: form.time,
      status: form.status,
      tags: this.tags(),
      assignedStaff: this.assignedStaff(),
      description: form.description || undefined,
      updatedAt: new Date().toISOString()
    };

    // TODO (backend): Add loading state and error handling
    this.serviceService.updateService(updated);
    this.router.navigate(['/service_management']);
  }

  /**
   * Save schedule for next session
   */
  saveSchedule(): void {
    if (!this.nextSessionDate) {
      alert('Please select a date for the next session');
      return;
    }

    const service = this.service();
    if (!service) {
      alert('Service information not available');
      return;
    }

    // Validate date format (should be YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(this.nextSessionDate)) {
      alert('Invalid date format. Please select a valid date.');
      return;
    }

    // Get customer ID if available
    let customerId: number | undefined;
    if (service.customerId) {
      customerId = service.customerId;
    } else {
      // Try to get customer ID by name
      const customer = this.customerService.getCustomerByName(service.customerName);
      if (customer) {
        customerId = customer.id;
      }
    }

    // Format time for display - ensure it's in proper format
    const timeDisplay = this.formatTimeForDisplay(this.nextSessionTime);
    
    // Validate time format
    if (!timeDisplay || !timeDisplay.match(/\d+:\d+\s*(AM|PM)/i)) {
      alert('Invalid time format. Please enter a valid time.');
      return;
    }

    // Create appointment with validated data
    const appointment = this.appointmentService.createAppointment({
      customerId,
      customerName: service.customerName || 'Unknown Customer',
      vehicle: service.vehicle || 'Unknown Vehicle',
      numberPlate: service.numberPlate,
      service: service.serviceType || 'Service',
      serviceId: this.serviceId!,
      date: this.nextSessionDate, // Already validated as YYYY-MM-DD format
      time: timeDisplay, // Already validated format
      status: 'Scheduled',
      notes: this.nextSessionNotes || `Next session for service: ${service.serviceType}`
    });

    // Show success message
    alert(
      `✅ Appointment scheduled successfully!\n\n` +
      `Date: ${this.nextSessionDate}\n` +
      `Time: ${timeDisplay}\n\n` +
      `The appointment has been automatically added to Google Calendar.`
    );

    // If Google Calendar link is available, offer to open it
    if (appointment.googleCalendarLink) {
      const openCalendar = confirm('Would you like to view the appointment in Google Calendar?');
      if (openCalendar) {
        window.open(appointment.googleCalendarLink, '_blank');
      }
    }

    // Clear the inputs
    this.nextSessionDate = '';
    this.nextSessionTime = '10:00';
    this.nextSessionNotes = '';
  }

  /**
   * Get minimum date (today) for date picker
   */
  getMinDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  /**
   * Format time for display (HH:mm to HH:MM AM/PM)
   */
  formatTimeForDisplay(time: string): string {
    if (!time) return '10:00 AM';
    
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  }

  /**
   * Cancel and go back
   */
  cancel(): void {
    this.router.navigate(['/service_management']);
  }

  /**
   * Create invoice for this service
   */
  createInvoice(): void {
    const currentService = this.service();
    if (!currentService) {
      alert('Service not found');
      return;
    }

    // Check if invoice already exists for this service
    const existingInvoices = this.invoiceService.getInvoicesByServiceId(currentService.id);
    if (existingInvoices.length > 0) {
      const confirmCreate = confirm(
        `An invoice already exists for this service (Invoice #${existingInvoices[0].id}). Do you want to create another one?`
      );
      if (!confirmCreate) {
        // Navigate to existing invoice
        this.router.navigate(['/dashboard/invoice-overview', existingInvoices[0].id]);
        return;
      }
    }

    // Navigate to invoice creation page
    this.router.navigate(['/service_management/create-invoice', currentService.id]);
  }

  /**
   * Get status button class for styling
   */
  getStatusButtonClass(status: ServiceStatus): string {
    const statusMap: Record<ServiceStatus, string> = {
      'Pending': 'red',
      'Inspection': 'blue',
      'Estimate Approved': 'yellow',
      'In Progress': 'orange',
      'Quality Check': 'light-yellow',
      'Pickup': 'green'
    };
    return statusMap[status] || 'default';
  }

  /**
   * Update service form field
   */
  updateFormField(field: 'serviceType' | 'date' | 'time' | 'description', value: string): void {
    this.serviceForm.update(form => ({ ...form, [field]: value }));
  }

  /**
   * Toggle warranty section visibility
   */
  toggleWarrantySection(): void {
    this.showWarrantySection.update(val => !val);
  }

  /**
   * Add warranty item to service
   */
  addWarrantyItem(): void {
    const currentService = this.service();
    const selectedItemId = this.selectedInventoryItemId();
    const installDate = this.warrantyInstallDate();

    if (!currentService || !selectedItemId || !installDate) {
      alert('Please select an inventory item and installation date');
      return;
    }

    const inventoryItem = this.inventoryService.getPartById(selectedItemId);
    if (!inventoryItem) {
      alert('Selected inventory item not found');
      return;
    }

    // Check if item already added
    const alreadyAdded = this.addedWarrantyItems().some(
      item => item.inventoryItemId === selectedItemId && item.serviceId === currentService.id
    );

    if (alreadyAdded) {
      alert('This item has already been added to this service');
      return;
    }

    // Resolve customer ID - try from service first, then find by name
    let customerId = currentService.customerId || 0;
    if (!customerId && currentService.customerName) {
      // Try to find customer by name
      const customer = this.customerService.getCustomerByName(currentService.customerName);
      if (customer) {
        customerId = customer.id;
      }
    }

    if (!customerId) {
      alert('Warning: Customer ID not found. Warranty item will be added but may not appear in customer view.');
    }

    // Add warranty item
    this.warrantyService.addWarrantyItem(
      currentService.id,
      customerId,
      inventoryItem.id,
      inventoryItem.partName,
      inventoryItem.supplier,
      inventoryItem.partNumber,
      installDate,
      inventoryItem.warranty.months,
      inventoryItem.warranty.years
    );

    // Refresh added items list
    const updatedWarranties = this.warrantyService.getWarrantyItemsByServiceId(currentService.id);
    this.addedWarrantyItems.set(updatedWarranties);

    // Reset form
    this.selectedInventoryItemId.set(null);
    this.warrantyInstallDate.set(new Date().toISOString().split('T')[0]);
  }

  /**
   * Remove warranty item
   */
  removeWarrantyItem(warrantyItemId: number): void {
    if (confirm('Are you sure you want to remove this warranty item?')) {
      this.warrantyService.removeWarrantyItem(warrantyItemId);
      const currentService = this.service();
      if (currentService) {
        const updatedWarranties = this.warrantyService.getWarrantyItemsByServiceId(currentService.id);
        this.addedWarrantyItems.set(updatedWarranties);
      }
    }
  }

  /**
   * Format warranty period
   */
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
}

