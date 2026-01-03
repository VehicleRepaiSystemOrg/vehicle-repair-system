import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Step {
  label: string;
  status: 'completed' | 'active' | 'pending';
  date?: string;
}

interface LineItem {
  name: string;
  description: string;
  qty: number;
  price: number;
}

@Component({
  selector: 'app-job-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './job-details.page.html',
  styleUrl: './job-details.page.scss'
})
export class JobDetailsPageComponent {
  
  // --- 1. Updated Progress Steps (6 Stages) ---
  steps: Step[] = [
    { label: 'New/Pending', status: 'completed', date: 'Jan 09' },
    { label: 'Inspection', status: 'completed', date: 'Jan 10' },
    { label: 'Estimate Approved', status: 'completed', date: 'Jan 10' },
    { label: 'In Progress', status: 'active', date: 'Now' },
    { label: 'Quality Check', status: 'pending' },
    { label: 'Ready for Pickup', status: 'pending' }
  ];

  // --- 2. MISSING DATA (Restored) ---
  // This is required because your HTML loop: @for (item of lineItems...)
  lineItems: LineItem[] = [
    { name: 'Brake Calipers (Front)', description: 'OEM Brembo High Performance', qty: 2, price: 325.00 },
    { name: 'Transmission Fluid', description: 'Synthetic ATF 4L', qty: 1, price: 85.00 },
    { name: 'Brake Pads', description: 'Ceramic composite pads', qty: 2, price: 57.50 },
    { name: 'Shop Supplies', description: 'Disposal fees & cleaners', qty: 1, price: 25.00 }
  ];

  messageMechanic() {
    console.log('Open chat modal...');
  }
}