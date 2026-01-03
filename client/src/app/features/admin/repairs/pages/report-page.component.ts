import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';

// Model and Component Imports
import { SalesReport, Transaction } from 'src/app/core/models/report.model';
import { ReportFilterComponent } from '../components/report-filter/report-filter.component';
import { SalesOverviewComponent } from '../components/sales-overview/sales-overview.component';
import { RecentSalesTableComponent } from '../components/recent-sales-table/recent-sales-table.component';

@Component({
  selector: 'app-report-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BaseChartDirective,
    ReportFilterComponent,
    SalesOverviewComponent,
    RecentSalesTableComponent
  ],
  templateUrl: './report-page.component.html',
  styleUrls: ['./report-page.component.scss']
})
export class ReportPageComponent implements OnInit {
  // 1. Date Picker Properties
  startDate = '';
  endDate = '';

  // 2. Mock Report Data Object
  report: SalesReport = {
    totalSales: 120000,
    salesByService: {
      'Oil Change': 20000,
      'Tire Rotation': 18000,
      'Brake Repair': 24000,
      'Engine Tune-up': 22000,
      'Other': 16000
    },
    trend: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      values: [12000, 15000, 13000, 17000, 14000, 18000, 15000]
    },
    recentSales: [
      { date: '2024-07-20', customer: 'Liam Harper', vehicle: 'Honda Civic', service: 'Oil Change', amount: 75 },
      { date: '2024-07-19', customer: 'Olivia Bennett', vehicle: 'Toyota Camry', service: 'Tire Rotation', amount: 50 },
      { date: '2024-07-18', customer: 'Ethan Carter', vehicle: 'Ford F-150', service: 'Brake Repair', amount: 300 },
      { date: '2024-07-17', customer: 'Ava Morgan', vehicle: 'Chevrolet Malibu', service: 'Engine Tune-up', amount: 200 }
    ] as Transaction[]
  };

  // --- 3. Chart Configurations (Properties) ---
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: { legend: { display: true } }
  };

  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: { legend: { position: 'top' } }
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: true } }
  };

  // --- 4. Chart Data Initializers ---
  public barChartData!: ChartData<'bar'>;
  public pieChartData!: ChartData<'pie'>;
  public lineChartData!: ChartData<'line'>;


  ngOnInit(): void {
    this.updateCharts();
  }

  /**
   * Maps the SalesReport object to the ChartData formats
   */
  private updateCharts(): void {
    if (!this.report) return;

    // Dynamic Bar Chart: Sales by Service
    this.barChartData = {
      labels: Object.keys(this.report.salesByService),
      datasets: [
        {
          data: Object.values(this.report.salesByService),
          label: 'Sales (Rs.)',
          backgroundColor: '#EA2A33',
          borderRadius: 5
        }
      ]
    };

    // Dynamic Pie Chart: Revenue Distribution
    this.pieChartData = {
      labels: Object.keys(this.report.salesByService),
      datasets: [{
        data: Object.values(this.report.salesByService),
        backgroundColor: ['#EA2A33', '#1e293b', '#94a3b8', '#cbd5e1', '#f1f5f9']
      }]
    };

    // Dynamic Line Chart: Sales Trend
    this.lineChartData = {
      labels: this.report.trend.labels,
      datasets: [
        {
          data: this.report.trend.values,
          label: 'Sales Trend',
          borderColor: '#EA2A33',
          backgroundColor: 'rgba(234, 42, 51, 0.1)',
          fill: true,
          tension: 0.4
        }
      ]
    };
  }

  /**
   * Triggered when the user changes a date
   */
  onDateChange(): void {
    console.log('Date Range Updated:', this.startDate, 'to', this.endDate);
  }

  /**
   * Triggered when the "Generate Report" button is clicked
   */
  onGenerate(range?: { startDate: string | null; endDate: string | null }): void {
    const start = range?.startDate || this.startDate;
    const end = range?.endDate || this.endDate;

    console.log('Generating report for:', { start, end });

    // After fetching new data from a service, you would call:
    // this.report = fetchedData;
    // this.updateCharts();
  }
}