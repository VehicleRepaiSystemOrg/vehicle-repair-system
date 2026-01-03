import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Customer {
  id: number;
  name: string;
  vehicle: string;
  numberPlate: string; // <--- Add this line
  service: string;
  date: string;
  time: string;
  phone: string;
  email: string;
  status: string; // 'Pending', 'Inspection', 'Estimate Approved', 'In Progress', 'Quality Check', 'Pickup'
}

@Injectable({ providedIn: 'root' })
export class CustomerService {
  // FIX: Add 'numberPlate' to every object in this array
  private initialData: Customer[] = [
    { 
      id: 1, 
      name: 'Liam Harper', 
      vehicle: '2018 Sedan', 
      numberPlate: 'WP-CAS-1234', // Add this
      service: 'Oil Change', 
      date: '2024-07-20', 
      time: '10:00 AM', 
      phone: '0771234567', 
      email: 'liam@example.com', 
      status: 'In Progress' 
    },
    { 
      id: 2, 
      name: 'Olivia Bennett', 
      vehicle: '2020 SUV', 
      numberPlate: 'WP-CAD-5566', // Add this
      service: 'Brake Repair', 
      date: '2024-07-20', 
      time: '2:00 PM', 
      phone: '0779876543', 
      email: 'olivia@example.com', 
      status: 'Inspection' 
    },
    { 
      id: 3, 
      name: 'Noah Carter', 
      vehicle: '2019 Truck', 
      numberPlate: 'CP-GA-9988', // Add this
      service: 'Tire Rotation', 
      date: '2024-07-20', 
      time: '11:00 AM', 
      phone: '0711112222', 
      email: 'noah@example.com', 
      status: 'Inspection' 
    }
  ];


  private customers$ = new BehaviorSubject<Customer[]>(this.initialData);
  allCustomers$ = this.customers$.asObservable();

  addCustomer(c: Partial<Customer>) {
    const current = this.customers$.value;
    const newEntry: Customer = { 
      id: Date.now(),
      name: c.name ?? 'Unknown',
      vehicle: c.vehicle ?? 'Unknown',
      numberPlate: c.numberPlate ?? '',
      service: c.service ?? '',
      date: c.date ?? '2024-01-01',
      time: c.time ?? '12:00 PM',
      phone: c.phone ?? '',
      email: c.email ?? '',
      status: c.status ?? 'Pending'
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

  removeCustomer(id: number) {
    const list = this.customers$.value.filter(c => c.id !== id);
    this.customers$.next(list);
  }
}
