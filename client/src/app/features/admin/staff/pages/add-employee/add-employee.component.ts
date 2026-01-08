import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { StaffService, StaffMember } from '../../services/staff.service';

@Component({
  selector: 'app-add-employee',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss']
})
export class AddEmployeeComponent {
  employee = { name: '', role: '', phone: '' };
  private readonly router = inject(Router);
  private readonly staffService = inject(StaffService);

  onCancel() {
    this.router.navigate(['/staff']); // Go back to staff page
  }

  onSubmit() {
    if (!this.employee.name.trim() || !this.employee.role.trim()) {
      alert('Please fill in name and role');
      return;
    }

    // Get the next available ID
    const currentStaff = this.staffService.getAllStaff();
    const nextId = currentStaff.length > 0 
      ? Math.max(...currentStaff.map((s: StaffMember) => s.id)) + 1 
      : 1;

    // Add new employee
    this.staffService.addStaff({
      id: nextId,
      name: this.employee.name.trim(),
      role: this.employee.role.trim(),
      phone: this.employee.phone.trim(),
      status: 'Active'
    });

    alert('Employee added successfully!');
    this.router.navigate(['/staff']);
  }
}
