import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface NotificationItem {
  id: number;
  customerName: string;
  serviceRequested: string;
  preferredDate: string;
  vehicleInfo: string;
  time: string; // Added time property
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private notifications = new BehaviorSubject<NotificationItem[]>([
    { id: 1, customerName: 'Ethan Harper', serviceRequested: 'Oil Change', preferredDate: '2024-03-15', vehicleInfo: 'Honda Civic, 2018', time: '10:00 AM' },
    { id: 2, customerName: 'Olivia Bennett', serviceRequested: 'Brake Repair', preferredDate: '2024-03-16', vehicleInfo: 'Toyota Camry, 2020', time: '01:30 PM' },
    { id: 3, customerName: 'Noah Carter', serviceRequested: 'Tire Replacement', preferredDate: '2024-03-17', vehicleInfo: 'Ford F-150, 2019', time: '09:15 AM' },
    { id: 4, customerName: 'Ava Morgan', serviceRequested: 'Engine Tune-up', preferredDate: '2024-03-18', vehicleInfo: 'Chevrolet Malibu, 2017', time: '03:00 PM' },
    { id: 5, customerName: 'Liam Foster', serviceRequested: 'Wheel Alignment', preferredDate: '2024-03-19', vehicleInfo: 'Nissan Altima, 2021', time: '11:45 AM' },
  ]);

  notifications$ = this.notifications.asObservable();

  removeNotification(id: number) {
    const current = this.notifications.value.filter(n => n.id !== id);
    this.notifications.next(current);
  }
}
