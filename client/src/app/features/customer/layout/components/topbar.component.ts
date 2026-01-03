import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { AsyncPipe } from '@angular/common';

const PAGE_TITLES: Record<string, string> = {
  'overview': 'Dashboard Overview',
  'my-repairs': 'My Repairs',
  'warranty': 'Warranty Tracking',
  'service-reminder': 'Service History',
  'settings': 'Account Settings',
  'book-service': 'Customer Support',
  'booking-confirmation': 'Booking Confirmation',
  'service-history': 'Service History',
  'invoice-overview': 'Invoices',
  'notifications': 'Notifications',
  'job-details': 'Job Details',
  'message-mechanic': 'Message Mechanic',
};

@Component({
  standalone: true,
  selector: 'app-customer-topbar',
  imports: [FormsModule, AsyncPipe],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopbarComponent {
  private readonly router = inject(Router);

  readonly pageTitle$ = this.router.events.pipe(
    filter(event => event instanceof NavigationEnd),
    map(() => {
      const url = this.router.url;
      const path = url.split('/').pop() || 'overview';
      return PAGE_TITLES[path] || 'Dashboard';
    }),
    startWith(this.getCurrentTitle())
  );

  search = '';

  private getCurrentTitle(): string {
    const url = this.router.url;
    const path = url.split('/').pop() || 'overview';
    return PAGE_TITLES[path] || 'Dashboard';
  }

  onSearch(searchTerm: string): void {
    if (!searchTerm.trim()) return;
    console.debug('[Topbar] Searching for:', searchTerm);
  }

  navigateToNotifications(): void {
    this.router.navigate(['/dashboard/notifications']);
  }
}