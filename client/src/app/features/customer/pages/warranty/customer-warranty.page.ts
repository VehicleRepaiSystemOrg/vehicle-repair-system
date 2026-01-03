import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Warranty {
  id: number;
  provider: string;
  item: string;
  details: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'expiring' | 'expired';
}

interface WarrantyHistory {
  id: number;
  provider: string;
  item: string;
  startDate: string;
  endDate: string;
}

@Component({
  standalone: true,
  selector: 'app-customer-warranty-page',
  imports: [CommonModule],
  templateUrl: './customer-warranty.page.html',
  styleUrl: './customer-warranty.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerWarrantyPageComponent {
  
  warranties: Warranty[] = [
    {
      id: 1,
      provider: 'Michelin Tires',
      item: 'Pilot Sport 4S (Front)',
      details: 'Road hazard protection & treadwear',
      startDate: '01/15/2024',
      endDate: '01/15/2026',
      status: 'active'
    },
    {
      id: 2,
      provider: 'Bosch Parts',
      item: 'Alternator Unit',
      details: 'Manufacturer defect warranty',
      startDate: '11/20/2023',
      endDate: '01/15/2025', 
      status: 'expiring'
    },
    {
      id: 3,
      provider: 'AutoZone',
      item: 'Gold Battery',
      details: '3-Year free replacement',
      startDate: '02/10/2022',
      endDate: '02/10/2025',
      status: 'active'
    },
    {
      id: 4,
      provider: '3M Auto',
      item: 'Ceramic Coating',
      details: 'Gloss & hydrophobicity',
      startDate: '05/20/2021',
      endDate: '05/20/2024',
      status: 'expired'
    }
  ];

  warrantyHistory: WarrantyHistory[] = [
    {
      id: 101,
      provider: 'Brembo',
      item: 'Ceramic Brake Pads',
      startDate: '01/01/2021',
      endDate: '01/01/2023',
    },
    {
      id: 102,
      provider: 'Dealership',
      item: 'Powertrain Coverage',
      startDate: '06/15/2018',
      endDate: '06/15/2023',
    },
    {
      id: 103,
      provider: 'Valvoline',
      item: 'Synthetic Oil Change',
      startDate: '01/10/2022',
      endDate: '01/10/2022',
    },
    {
      id: 104,
      provider: 'Bridgestone',
      item: 'All-Weather Tires',
      startDate: '03/05/2020',
      endDate: '03/05/2022',
    },
    {
      id: 105,
      provider: 'NAPA Auto',
      item: 'Wiper Blades',
      startDate: '08/12/2021',
      endDate: '08/12/2022',
    },
    {
      id: 106,
      provider: 'Service Center',
      item: 'AC Compressor',
      startDate: '02/20/2019',
      endDate: '02/20/2021',
    },
    {
      id: 107,
      provider: 'AutoZone',
      item: 'Spark Plugs',
      startDate: '11/15/2019',
      endDate: '11/15/2020',
    }
  ];
}