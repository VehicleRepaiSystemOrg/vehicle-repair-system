import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { StaffService, StaffMember } from '../../services/staff.service';

@Component({
  selector: 'app-edit-employee',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.scss']
})
export class EditEmployeeComponent implements OnInit {
  member?: StaffMember;
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly staffService = inject(StaffService);

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const data = this.staffService.getStaffById(id);
    if (data) {
      this.member = { ...data }; // Create a copy to edit
    }
  }

  onChange() {
    if (this.member) {
      this.staffService.updateStaff(this.member);
      this.router.navigate(['/staff']);
    }
  }

  onRemove() {
    if (this.member) {
      this.staffService.removeStaff(this.member.id);
      this.router.navigate(['/staff']);
    }
  }

  onCancel() {
    this.router.navigate(['/staff']);
  }
}
