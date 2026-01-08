import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Customer {
  id: number;
  name: string;
  vehicles: { name: string; numberPlate: string }[];
  service: string;
  date: string;
  time: string;
  phone: string;
  email: string;
  status: string; // 'Pending', 'Inspection', 'Estimate Approved', 'In Progress', 'Quality Check', 'Pickup'
  registeredDate: string;
}

@Injectable({ providedIn: 'root' })
export class CustomerService {
  // FIX: Update to new vehicle structure
  private initialData: Customer[] = [
    { 
      id: 1, 
      name: 'Liam Harper', 
      vehicles: [{ name: '2018 Sedan', numberPlate: 'WP-CAS-1234' }],
      service: 'Oil Change', 
      date: '2024-07-20', 
      time: '10:00 AM', 
      phone: '0771234567', 
      email: 'liam@example.com', 
      status: 'In Progress',
      registeredDate: '2024-01-15'
    },
    { 
      id: 2, 
      name: 'Olivia Bennett', 
      vehicles: [{ name: '2020 SUV', numberPlate: 'WP-CAD-5566' }],
      service: 'Brake Repair', 
      date: '2024-07-20', 
      time: '2:00 PM', 
      phone: '0779876543', 
      email: 'olivia@example.com', 
      status: 'Inspection',
      registeredDate: '2024-02-10'
    },
    { 
      id: 3, 
      name: 'Noah Carter', 
      vehicles: [{ name: '2019 Truck', numberPlate: 'CP-GA-9988' }],
      service: 'Tire Rotation', 
      date: '2024-07-20', 
      time: '11:00 AM', 
      phone: '0711112222', 
      email: 'noah@example.com', 
      status: 'Inspection',
      registeredDate: '2024-03-05'
    }
  ];


  private customers$ = new BehaviorSubject<Customer[]>(this.initialData);
  allCustomers$ = this.customers$.asObservable();

  addCustomer(c: Partial<Customer>) {
    const current = this.customers$.value;
    const newEntry: Customer = { 
      id: Date.now(),
      name: c.name ?? 'Unknown',
      vehicles: c.vehicles ?? [{ name: 'Unknown', numberPlate: '' }],
      service: c.service ?? '',
      date: c.date ?? '2024-01-01',
      time: c.time ?? '12:00 PM',
      phone: c.phone ?? '',
      email: c.email ?? '',
      status: c.status ?? 'Pending',
      registeredDate: new Date().toISOString().split('T')[0]
    };
    this.customers$.next([...current, newEntry]);
  }

  updateCustomer(updated: Customer) {
    const list = this.customers$.value.map(c => c.id === updated.id ? updated : c);
    this.customers$.next(list);
  }

  getCustomerById(id: number) {
    return this.customers$.value.find(c => c.id === id);
  }

  getCustomerByName(name: string) {
    return this.customers$.value.find(c => c.name.toLowerCase() === name.toLowerCase());
  }

  removeCustomer(id: number) {
    const list = this.customers$.value.filter(c => c.id !== id);
    this.customers$.next(list);
  }
}
