import { ChangeDetectionStrategy, Component, OnInit, OnDestroy, inject, signal, computed, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WarrantyService, WarrantyItem } from '../../../../core/services/warranty.service';
import { Subscription } from 'rxjs';

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
export class CustomerWarrantyPageComponent implements OnInit, OnDestroy {
  private readonly warrantyService = inject(WarrantyService);
  private readonly cdr = inject(ChangeDetectorRef);
  private subscription?: Subscription;
  
  // TODO: Get customer ID from auth service or route
  // For now, using a mock customer ID - replace with actual customer ID
  private readonly customerId = 1; // This should come from authentication/route
  
  warrantyItems = signal<WarrantyItem[]>([]);
  
  // Convert warranty items to display format - show all items including expired in main section
  warranties = computed(() => {
    // Sort items: expired first (highlighted), then expiring, then active
    const sortedItems = [...this.warrantyItems()].sort((a, b) => {
      const statusOrder = { 'expired': 0, 'expiring': 1, 'active': 2 };
      return (statusOrder[a.status] || 3) - (statusOrder[b.status] || 3);
    });
    
    return sortedItems.map(item => ({
      id: item.id,
      provider: item.supplier,
      item: item.partName,
      details: `Part Number: ${item.partNumber} - Warranty: ${this.formatWarranty(item.warrantyMonths, item.warrantyYears)}`,
      startDate: this.formatDate(item.startDate),
      endDate: this.formatDate(item.endDate),
      status: item.status
    }));
  });

  // Count warranties by status
  activeCount = computed(() => this.warranties().filter(w => w.status === 'active').length);
  expiringCount = computed(() => this.warranties().filter(w => w.status === 'expiring').length);
  expiredCount = computed(() => this.warranties().filter(w => w.status === 'expired').length);
  
  warrantyHistory = computed(() => {
    // Get expired warranties for history
    return this.warrantyItems()
      .filter(item => item.status === 'expired')
      .map(item => ({
        id: item.id,
        provider: item.supplier,
        item: item.partName,
        startDate: this.formatDate(item.startDate),
        endDate: this.formatDate(item.endDate)
      }));
  });

  ngOnInit(): void {
    // Load warranty items for this customer
    this.subscription = this.warrantyService.allWarrantyItems$.subscribe(items => {
      // Refresh statuses first
      this.warrantyService.refreshWarrantyStatuses();
      
      // Get updated items after refresh
      const allItems = this.warrantyService.getAllWarrantyItems();
      const customerItems = allItems.filter(item => item.customerId === this.customerId);
      this.warrantyItems.set(customerItems);
      
      // Trigger change detection for OnPush
      this.cdr.markForCheck();
    });
    
    // Initial load
    this.loadWarrantyItems();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  private loadWarrantyItems(): void {
    // Refresh statuses
    this.warrantyService.refreshWarrantyStatuses();
    
    // Get all warranty items
    const allItems = this.warrantyService.getAllWarrantyItems();
    const customerItems = allItems.filter(item => item.customerId === this.customerId);
    this.warrantyItems.set(customerItems);
    
    // Trigger change detection
    this.cdr.markForCheck();
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
  }

  formatWarranty(months: number, years: number): string {
    if (years === 0 && months === 0) {
      return 'No Warranty';
    }
    const parts: string[] = [];
    if (years > 0) {
      parts.push(`${years} year${years > 1 ? 's' : ''}`);
    }
    if (months > 0) {
      parts.push(`${months} month${months > 1 ? 's' : ''}`);
    }
    return parts.join(' ');
  }
  
  // Keep old mock data for fallback/display purposes if needed
  oldWarranties: Warranty[] = [
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
}