import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SalesReport, Transaction } from 'src/app/core/models/report.model';

@Injectable({ providedIn: 'root' })
export class ReportService {
  private readonly http = inject(HttpClient);

  // TODO: implement and type-check endpoints with your backend
  getSalesOverview(startDate?: string | null, endDate?: string | null): Observable<SalesReport> {
    let params = new HttpParams();
    if (startDate) params = params.set('start', startDate);
    if (endDate) params = params.set('end', endDate);
    return this.http.get<SalesReport>('/api/reports/sales-overview', { params });
  }

  getRecentSales(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>('/api/reports/recent-sales');
  }
}
