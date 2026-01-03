import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Required for | async pipe
import { Observable, of } from 'rxjs';
// Import your child components
import { StatCardComponent } from '../components/stat-card.component';
import { CalendarWidgetComponent } from '../components/calendar-widget.component';
import { RepairTableComponent } from '../components/repair-table.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  // Add child components and CommonModule to imports
  imports: [
    CommonModule, 
    StatCardComponent, 
    CalendarWidgetComponent, 
    RepairTableComponent
  ],
  templateUrl: './admin-dashboard.stub.html',
  styleUrls: ['./admin-dashboard.stub.scss']
})
export class AdminDashboardStubComponent {
  // FIX: Define the property the HTML is looking for
  // Using 'of' to create a mock observable for now
  availableStaffCount$: Observable<string> = of('3 / 5');
}