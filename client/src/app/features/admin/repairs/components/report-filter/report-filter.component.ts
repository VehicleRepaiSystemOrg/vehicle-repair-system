import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-report-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './report-filter.component.html',
  styleUrls: ['./report-filter.component.scss']
})
export class ReportFilterComponent {
  @Output() generate = new EventEmitter<{ startDate: string | null; endDate: string | null }>();

  startDate: string | null = null;
  endDate: string | null = null;

  onGenerate() {
    // TODO: Inject RepairsService to send date ranges to GET /api/reports/sales-overview
    this.generate.emit({ startDate: this.startDate, endDate: this.endDate });
  }
}
