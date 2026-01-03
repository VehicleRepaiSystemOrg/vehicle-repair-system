import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface ServiceItem {
  id: number;
  date: string;
  vehicle: string;
  service: string;
}

@Component({
  standalone: true,
  selector: 'app-customer-service-reminder-page',
  imports: [CommonModule, RouterLink],
  templateUrl: './customer-service-reminder.page.html',
  styleUrl: './customer-service-reminder.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerServiceReminderPageComponent {

  vehicleLabel = 'VEHICLE #1234';

  serviceHistory: ServiceItem[] = [
    {
      id: 101,
      date: '08/10/2024',
      vehicle: '2018 Sedan',
      service: 'Tire Rotation'
    },
    {
      id: 102,
      date: '05/22/2024',
      vehicle: '2018 Sedan',
      service: 'Air Filter Replacement'
    },
    {
      id: 103,
      date: '01/15/2024',
      vehicle: '2018 Sedan',
      service: '30k Mile Service'
    },
    {
      id: 104,
      date: '10/12/2023',
      vehicle: '2018 Sedan',
      service: 'Brake Pad Replacement'
    },
    {
      id: 105,
      date: '06/05/2023',
      vehicle: '2018 Sedan',
      service: 'Oil Change & Filter'
    },
    {
      id: 106,
      date: '02/20/2023',
      vehicle: '2018 Sedan',
      service: 'Wheel Alignment'
    }
  ];

}