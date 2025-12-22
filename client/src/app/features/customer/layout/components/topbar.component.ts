import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-customer-topbar',
  imports: [FormsModule, RouterLink],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopbarComponent {
  // TODO (backend): Implement search functionality
  // GET /customer/search?q={searchTerm} - Search across repairs, invoices, services, etc.
  // Expected response: { repairs: [], invoices: [], services: [] }
  // Should debounce search input and call API on user input
  search = '';

  // TODO (backend): Implement search method
  onSearch(searchTerm: string): void {
    // TODO (backend): Call search API endpoint with debounced search term
    // Display search results in dropdown or navigate to search results page
    console.debug('[Topbar] Search:', searchTerm);
  }
}
