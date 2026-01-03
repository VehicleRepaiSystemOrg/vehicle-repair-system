import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalesReport } from 'src/app/core/models/report.model';

@Component({
  selector: 'app-sales-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sales-overview.component.html',
  styleUrls: ['./sales-overview.component.scss']
})
export class SalesOverviewComponent implements OnChanges {
  @Input() report: SalesReport | null = null;

  // TODO: Replace placeholders with real Chart.js or ngx-charts implementations
  // TODO: Subscribe to a ReportService to receive dynamic data

  ngOnChanges(changes: SimpleChanges) {
    if (changes['report'] && this.report) {
      // Update charts when `report` input changes
    }
  }

  calculateTotal(map: Record<string, number> | undefined): number {
    if (!map) return 0;
    return Object.values(map).reduce((s, v) => s + v, 0);
  }
}
