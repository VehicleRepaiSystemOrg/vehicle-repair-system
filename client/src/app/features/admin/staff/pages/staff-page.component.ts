import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-staff-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './staff-page.component.html',
  styleUrls: ['./staff-page.component.scss']
})
export class StaffPageComponent {
  // TODO: Inject StaffService to load staff list from backend (/api/staff)
  staff = [
    { id: '1', name: 'Alex Rivera', role: 'Technician', status: 'Active' },
    { id: '2', name: 'Maria Gomez', role: 'Service Writer', status: 'Active' },
    { id: '3', name: 'Sam Patel', role: 'Manager', status: 'On Leave' }
  ];
}
