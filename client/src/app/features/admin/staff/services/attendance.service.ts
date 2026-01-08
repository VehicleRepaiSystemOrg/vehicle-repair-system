import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface AttendanceRecord {
  id: number;
  employeeId: number;
  date: string; // YYYY-MM-DD format
  status: 'present' | 'absent' | 'late' | 'leave';
  checkIn?: string; // HH:mm format
  checkOut?: string; // HH:mm format
  notes?: string;
}

export interface MonthlyAttendance {
  employeeId: number;
  employeeName: string;
  month: string; // YYYY-MM format
  records: AttendanceRecord[];
  totalPresent: number;
  totalAbsent: number;
  totalLate: number;
  totalLeave: number;
}

@Injectable({ providedIn: 'root' })
export class AttendanceService {
  private attendanceRecords$ = new BehaviorSubject<AttendanceRecord[]>([]);

  // Public observable
  allAttendance$: Observable<AttendanceRecord[]> = this.attendanceRecords$.asObservable();

  constructor() {
    // Initialize with some sample data
    const today = new Date();
    const sampleRecords: AttendanceRecord[] = [
      {
        id: 1,
        employeeId: 1,
        date: today.toISOString().split('T')[0],
        status: 'present',
        checkIn: '08:30',
        checkOut: '17:00'
      },
      {
        id: 2,
        employeeId: 2,
        date: today.toISOString().split('T')[0],
        status: 'present',
        checkIn: '09:00',
        checkOut: '18:00'
      }
    ];
    this.attendanceRecords$.next(sampleRecords);
  }

  /**
   * Mark attendance for an employee
   */
  markAttendance(employeeId: number, date: string, status: 'present' | 'absent' | 'late' | 'leave', checkIn?: string, checkOut?: string, notes?: string): void {
    const existing = this.attendanceRecords$.value.find(
      r => r.employeeId === employeeId && r.date === date
    );

    if (existing) {
      // Update existing record
      const updated = this.attendanceRecords$.value.map(r =>
        r.id === existing.id
          ? { ...r, status, checkIn, checkOut, notes }
          : r
      );
      this.attendanceRecords$.next(updated);
    } else {
      // Create new record
      const newRecord: AttendanceRecord = {
        id: Date.now(),
        employeeId,
        date,
        status,
        checkIn,
        checkOut,
        notes
      };
      this.attendanceRecords$.next([...this.attendanceRecords$.value, newRecord]);
    }
  }

  /**
   * Get attendance records for an employee in a specific month
   */
  getEmployeeMonthlyAttendance(employeeId: number, month: string): AttendanceRecord[] {
    return this.attendanceRecords$.value.filter(
      r => r.employeeId === employeeId && r.date.startsWith(month)
    );
  }

  /**
   * Get all attendance records for a specific month
   */
  getMonthlyAttendance(month: string): AttendanceRecord[] {
    return this.attendanceRecords$.value.filter(r => r.date.startsWith(month));
  }

  /**
   * Get attendance summary for an employee in a month
   */
  getEmployeeAttendanceSummary(employeeId: number, month: string, employeeName: string): MonthlyAttendance {
    const records = this.getEmployeeMonthlyAttendance(employeeId, month);
    
    return {
      employeeId,
      employeeName,
      month,
      records,
      totalPresent: records.filter(r => r.status === 'present').length,
      totalAbsent: records.filter(r => r.status === 'absent').length,
      totalLate: records.filter(r => r.status === 'late').length,
      totalLeave: records.filter(r => r.status === 'leave').length
    };
  }

  /**
   * Get all attendance records
   */
  getAllAttendance(): AttendanceRecord[] {
    return this.attendanceRecords$.value;
  }

  /**
   * Delete an attendance record
   */
  deleteAttendance(recordId: number): void {
    const updated = this.attendanceRecords$.value.filter(r => r.id !== recordId);
    this.attendanceRecords$.next(updated);
  }
}

