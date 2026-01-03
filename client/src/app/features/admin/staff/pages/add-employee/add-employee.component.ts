import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

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

  onCancel() {
    this.router.navigate(['/staff']); // Go back to staff page
  }

  onSubmit() {
    console.log('Employee Data:', this.employee);
    // Logic to save data would go here
    this.router.navigate(['/staff']);
  }
}
