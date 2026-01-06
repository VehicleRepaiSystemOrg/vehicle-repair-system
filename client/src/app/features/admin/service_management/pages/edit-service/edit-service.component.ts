import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ServiceService, Service, ServiceStatus, AssignedStaff } from '../../services/service.service';
import { StaffService, StaffMember } from '../../../staff/services/staff.service';

/**
 * Edit Service Component
 * Allows admin to manage service status and details
 * Includes status change with progress tracker, tag management, and staff assignments
 */
@Component({
  selector: 'app-edit-service',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-service.component.html',
  styleUrls: ['./edit-service.component.scss']
})
export class EditServiceComponent implements OnInit {
  private readonly serviceService = inject(ServiceService);
  private readonly staffService = inject(StaffService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

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
    // TODO (backend): Save next session date to backend
    // This could be stored in the service or as a separate appointment
    console.log('Saving schedule:', this.nextSessionDate);
    alert('Next session scheduled for: ' + this.nextSessionDate);
  }

  /**
   * Cancel and go back
   */
  cancel(): void {
    this.router.navigate(['/service_management']);
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
}

