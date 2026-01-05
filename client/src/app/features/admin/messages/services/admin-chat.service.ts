import { Injectable, signal } from '@angular/core';

export interface Customer {
  id: string;
  name: string;
  lastMessage: string;
}

@Injectable({ providedIn: 'root' })
export class AdminChatService {
  selectedCustomer = signal<Customer | null>(null);

  customers: Customer[] = [
    { id: '1', name: 'John Perera', lastMessage: 'Any update?' },
    { id: '2', name: 'Kamal Silva', lastMessage: 'Thanks admin' },
    { id: '3', name: 'Nimal Fernando', lastMessage: 'Please call me' },
  ];

  selectCustomer(customer: Customer) {
    this.selectedCustomer.set(customer);
  }
}