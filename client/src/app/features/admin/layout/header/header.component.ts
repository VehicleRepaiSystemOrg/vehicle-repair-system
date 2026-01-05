import { Component, OnInit, inject } from '@angular/core';
import { Router, NavigationEnd, RouterLink } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  pageTitle = 'Dashboard Overview';
  private readonly router = inject(Router);

  ngOnInit() {
    // Listen for every time the page changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateTitle();
    });

    // Run once on initial load
    this.updateTitle();
  }

  private updateTitle() {
    const url = this.router.url;

    // Logic to set the title based on the URL path
    if (url.includes('admin/dashboard')) {
      this.pageTitle = 'Dashboard Overview';
    } else if (url.includes('reports')) {
      this.pageTitle = 'Reports Overview';
    } else if (url.includes('staff')) {
      this.pageTitle = 'Staff Overview';
    } else if (url.includes('inventory')) {
      this.pageTitle = 'Inventory Overview';
    }else if (url.includes('messages')) {
      this.pageTitle = 'Message Overview';
    } else if (url.includes('settings')) {
      this.pageTitle = 'Settings';
    } else if (url.includes('customer_overview')) { // ADD THIS BLOCK
      this.pageTitle = 'Dashboard Overview'; // This matches the top bar in (026)
    } else {
      this.pageTitle = 'Dashboard Overview';
    }
  }
}