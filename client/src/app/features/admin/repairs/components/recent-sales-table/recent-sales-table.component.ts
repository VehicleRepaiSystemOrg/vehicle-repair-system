import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Transaction } from 'src/app/core/models/report.model';

@Component({
  selector: 'app-recent-sales-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recent-sales-table.component.html',
  styleUrls: ['./recent-sales-table.component.scss']
})
export class RecentSalesTableComponent {
  @Input() transactions: Transaction[] = [];

  // TODO: replace with paginated table when fetching from backend (GET /api/reports/recent-sales)
}
