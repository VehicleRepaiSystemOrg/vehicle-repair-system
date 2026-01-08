import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable, Subscription, take } from 'rxjs';
import { FormsModule } from '@angular/forms';

// Import the shared button component and the service
import { AddEmployeeButtonComponent } from '../components/add-employee-button/add-employee-button.component';
import { StaffService, StaffMember } from '../services/staff.service';
import { AttendanceService, MonthlyAttendance, AttendanceRecord } from '../services/attendance.service';

@Component({
  selector: 'app-staff-management',
  standalone: true,
  imports: [
    CommonModule, 
    AddEmployeeButtonComponent, 
    RouterLink,
    FormsModule
  ],
  templateUrl: './staff-management.component.html',
  styleUrls: ['./staff-management.component.scss']
})
export class StaffManagementComponent implements OnInit, OnDestroy {
  // Define the observable for the template
  staff$!: Observable<StaffMember[]>;
  private readonly staffService = inject(StaffService);
  private readonly attendanceService = inject(AttendanceService);
  private subscriptions = new Subscription();

  // Attendance management
  selectedMonth = signal<string>(new Date().toISOString().slice(0, 7)); // YYYY-MM format
  showAttendance = signal<boolean>(false);
  monthlyAttendance = signal<MonthlyAttendance[]>([]);
  searchQuery = signal<string>('');
  
  // Attendance marking
  showMarkAttendance = signal<boolean>(false);
  selectedEmployeeId = signal<number | null>(null);
  selectedDate = signal<string>(new Date().toISOString().split('T')[0]);
  attendanceStatus = signal<'present' | 'absent' | 'late' | 'leave'>('present');
  checkInTime = signal<string>('08:00');
  checkOutTime = signal<string>('17:00');
  
  // Employee attendance details view
  showEmployeeAttendance = signal<boolean>(false);
  selectedEmployeeForDetails = signal<number | null>(null);
  employeeAttendanceRecords = signal<AttendanceRecord[]>([]);

  ngOnInit(): void {
    // Connect the local observable to the service's data stream
    this.staff$ = this.staffService.staff$;
    
    // Load attendance data
    this.loadMonthlyAttendance();
    
    // Subscribe to attendance changes
    const attendanceSub = this.attendanceService.allAttendance$.subscribe(() => {
      this.loadMonthlyAttendance();
      // Trigger change detection to update attendance status in table
    });
    this.subscriptions.add(attendanceSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  /**
   * Toggles a staff member's status between Active and Inactive
   */
  onToggleStatus(id: number): void {
    this.staffService.toggleStatus(id);
  }

  /**
   * Removes a staff member from the system
   */
  removeMember(id: number): void {
    if (confirm('Are you sure you want to remove this staff member?')) {
      this.staffService.removeStaff(id);
    }
  }

  /**
   * Toggle attendance view
   */
  toggleAttendanceView(): void {
    this.showAttendance.update(val => !val);
    if (!this.showAttendance()) {
      this.loadMonthlyAttendance();
    }
  }

  /**
   * Load monthly attendance for all employees
   */
  loadMonthlyAttendance(): void {
    this.staffService.staff$.pipe(take(1)).subscribe(staff => {
      const month = this.selectedMonth();
      const attendance: MonthlyAttendance[] = staff
        .filter(employee => employee.status === 'Active')
        .map(employee => 
          this.attendanceService.getEmployeeAttendanceSummary(
            employee.id,
            month,
            employee.name
          )
        );
      this.monthlyAttendance.set(attendance);
    });
  }

  /**
   * Handle month change
   */
  onMonthChange(month: string): void {
    this.selectedMonth.set(month);
    this.loadMonthlyAttendance();
  }

  /**
   * Open attendance marking form
   */
  openMarkAttendance(employeeId: number): void {
    this.selectedEmployeeId.set(employeeId);
    this.selectedDate.set(new Date().toISOString().split('T')[0]);
    this.attendanceStatus.set('present');
    this.checkInTime.set('08:00');
    this.checkOutTime.set('17:00');
    this.showMarkAttendance.set(true);
  }

  /**
   * Close attendance marking form
   */
  closeMarkAttendance(): void {
    this.showMarkAttendance.set(false);
    this.selectedEmployeeId.set(null);
  }

  /**
   * Mark attendance for an employee
   */
  markAttendance(): void {
    const employeeId = this.selectedEmployeeId();
    const date = this.selectedDate();
    const status = this.attendanceStatus();
    
    if (!employeeId || !date) {
      alert('Please select employee and date');
      return;
    }

    const checkIn = status === 'present' || status === 'late' ? this.checkInTime() : undefined;
    const checkOut = status === 'present' || status === 'late' ? this.checkOutTime() : undefined;

    this.attendanceService.markAttendance(employeeId, date, status, checkIn, checkOut);
    this.loadMonthlyAttendance();
    this.closeMarkAttendance();
    alert('Attendance marked successfully!');
  }

  /**
   * Get employee name by ID
   */
  getEmployeeName(employeeId: number, staff: StaffMember[]): string {
    const employee = staff.find(s => s.id === employeeId);
    return employee?.name || 'Unknown';
  }

  /**
   * Get filtered staff based on search
   */
  getFilteredStaff(staff: StaffMember[]): StaffMember[] {
    const query = this.searchQuery().toLowerCase();
    if (!query) return staff;
    return staff.filter(s => 
      s.name.toLowerCase().includes(query) ||
      s.role.toLowerCase().includes(query)
    );
  }

  /**
   * Get employee role by ID
   */
  getEmployeeRole(employeeId: number, staff: StaffMember[]): string {
    const employee = staff.find(s => s.id === employeeId);
    return employee?.role || 'N/A';
  }

  /**
   * Get today's attendance status for an employee
   */
  getTodayAttendanceStatus(employeeId: number): 'present' | 'absent' | 'late' | 'leave' | null {
    const today = new Date().toISOString().split('T')[0];
    const records = this.attendanceService.getAllAttendance();
    const todayRecord = records.find(r => r.employeeId === employeeId && r.date === today);
    return todayRecord ? todayRecord.status : null;
  }

  /**
   * Get attendance status display text
   */
  getAttendanceStatusText(status: 'present' | 'absent' | 'late' | 'leave' | null): string {
    if (!status) return 'Not Marked';
    const statusMap = {
      'present': 'Present',
      'absent': 'Absent',
      'late': 'Late',
      'leave': 'On Leave'
    };
    return statusMap[status];
  }

  /**
   * Get attendance status class for styling
   */
  getAttendanceStatusClass(status: 'present' | 'absent' | 'late' | 'leave' | null): string {
    if (!status) return 'status-not-marked';
    return `status-${status}`;
  }

  /**
   * View employee attendance details
   */
  viewEmployeeAttendance(employeeId: number): void {
    this.selectedEmployeeForDetails.set(employeeId);
    const month = this.selectedMonth();
    const records = this.attendanceService.getEmployeeMonthlyAttendance(employeeId, month);
    this.employeeAttendanceRecords.set(records);
    this.showEmployeeAttendance.set(true);
  }

  /**
   * Close employee attendance details
   */
  closeEmployeeAttendance(): void {
    this.showEmployeeAttendance.set(false);
    this.selectedEmployeeForDetails.set(null);
    this.employeeAttendanceRecords.set([]);
  }

  /**
   * Format date for display
   */
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  }

  /**
   * Edit attendance record
   */
  editAttendanceRecord(record: AttendanceRecord): void {
    this.selectedEmployeeId.set(record.employeeId);
    this.selectedDate.set(record.date);
    this.attendanceStatus.set(record.status);
    this.checkInTime.set(record.checkIn || '08:00');
    this.checkOutTime.set(record.checkOut || '17:00');
    this.closeEmployeeAttendance();
    this.showMarkAttendance.set(true);
  }

  /**
   * Get attendance summary for selected employee
   */
  getSelectedEmployeeSummary(): MonthlyAttendance | null {
    const employeeId = this.selectedEmployeeForDetails();
    if (!employeeId) return null;
    return this.monthlyAttendance().find(a => a.employeeId === employeeId) || null;
  }
}