import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';

// Unified Interface with strict status typing
export interface StaffMember {
  id: number;
  name: string;
  role: string;
  phone: string;
  status: 'Active' | 'Inactive';
}

@Injectable({ providedIn: 'root' })
export class StaffService {
  private initialStaff: StaffMember[] = [
    { id: 1, name: 'Ethan Harper', role: 'Mechanic', status: 'Active', phone: '0123456789' },
    { id: 2, name: 'Olivia Bennett', role: 'Service Advisor', status: 'Active', phone: '0123456789' },
    { id: 3, name: 'Noah Carter', role: 'Technician', status: 'Active', phone: '0123456789' },
    { id: 4, name: 'Ava Thompson', role: 'Parts Manager', status: 'Inactive', phone: '0123456789' },
    { id: 5, name: 'Liam Foster', role: 'Detailer', status: 'Inactive', phone: '0123456789' }
  ];

  private staffSubject = new BehaviorSubject<StaffMember[]>(this.initialStaff);

  // Observables
  staff$ = this.staffSubject.asObservable();

  activeStaffCount$ = this.staff$.pipe(
    map(staff => staff.filter(s => s.status === 'Active').length)
  );

  // --- Methods ---

  // Get a single member by ID
  getStaffById(id: number): StaffMember | undefined {
    return this.staffSubject.value.find(s => s.id === id);
  }

  // Update an existing member
  updateStaff(updatedMember: StaffMember) {
    const currentStaff = this.staffSubject.value.map(member =>
      member.id === updatedMember.id ? updatedMember : member
    );
    this.staffSubject.next(currentStaff);
  }

  // Quickly toggle status between Active and Inactive
  toggleStatus(id: number) {
    const updatedStaff = this.staffSubject.value.map(member => {
      if (member.id === id) {
        return {
          ...member,
          status: (member.status === 'Active' ? 'Inactive' : 'Active') as 'Active' | 'Inactive'
        };
      }
      return member;
    });
    this.staffSubject.next(updatedStaff);
  }

  // Remove a member from the list
  removeStaff(id: number) {
    const updatedStaff = this.staffSubject.value.filter(member => member.id !== id);
    this.staffSubject.next(updatedStaff);
  }

  // Add a new member (Extra helper method)
  addStaff(newMember: StaffMember) {
    const currentStaff = [...this.staffSubject.value, newMember];
    this.staffSubject.next(currentStaff);
  }
}
