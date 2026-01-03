import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';

// Import the shared button component and the service
import { AddEmployeeButtonComponent } from '../components/add-employee-button/add-employee-button.component';
import { StaffService, StaffMember } from '../services/staff.service';

@Component({
  selector: 'app-staff-management',
  standalone: true,
  imports: [
    CommonModule, 
    AddEmployeeButtonComponent, 
    RouterLink
  ],
  templateUrl: './staff-management.component.html',
  styleUrls: ['./staff-management.component.scss']
})
export class StaffManagementComponent implements OnInit {
  // Define the observable for the template
  staff$!: Observable<StaffMember[]>;
  private readonly staffService = inject(StaffService);

  ngOnInit(): void {
    // Connect the local observable to the service's data stream
    this.staff$ = this.staffService.staff$;
  }

  /**
   * Toggles a staff member's status between Active and Inactive
   */
  onToggleStatus(id: number): void {
    this.staffService.toggleStatus(id);
  }

  /**
   * Removes a staff member from the system
   */
  removeMember(id: number): void {
    if (confirm('Are you sure you want to remove this staff member?')) {
      this.staffService.removeStaff(id);
    }
  }
}