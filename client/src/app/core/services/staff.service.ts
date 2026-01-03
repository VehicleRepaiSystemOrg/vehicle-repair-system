import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from 'src/app/core/models/employee.model';

@Injectable({ providedIn: 'root' })
export class StaffService {
  private base = '/api/staff';
  private readonly http = inject(HttpClient);

  // TODO: implement proper error handling and typing
  getStaff(): Observable<Employee[]> { return this.http.get<Employee[]>(this.base); }
  getEmployee(id: string): Observable<Employee> { return this.http.get<Employee>(`${this.base}/${id}`); }
  addEmployee(payload: Partial<Employee>): Observable<Employee> { return this.http.post<Employee>(this.base, payload); }
  updateEmployee(id: string, payload: Partial<Employee>): Observable<Employee> { return this.http.put<Employee>(`${this.base}/${id}`, payload); }
  deleteEmployee(id: string): Observable<void> { return this.http.delete<void>(`${this.base}/${id}`); }
}
