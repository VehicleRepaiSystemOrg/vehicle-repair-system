import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { StatCardComponent } from '../../../../shared/components/stat-card/stat-card.component';
import { InventoryService, InventoryItem } from '../services/inventory.service';

@Component({
  selector: 'app-inventory-management',
  standalone: true,
  imports: [CommonModule, StatCardComponent, RouterLink],
  templateUrl: './inventory-management.component.html',
  styleUrls: ['./inventory-management.component.scss']
})
export class InventoryManagementComponent implements OnInit {
  parts$!: Observable<InventoryItem[]>;
  private readonly inventoryService = inject(InventoryService);

  ngOnInit() {
    this.parts$ = this.inventoryService.parts$;
  }

  formatWarranty(warranty: { months: number; years: number }): string {
    if (warranty.years === 0 && warranty.months === 0) {
      return 'No Warranty';
    }
    
    const parts: string[] = [];
    if (warranty.years > 0) {
      parts.push(`${warranty.years} year${warranty.years > 1 ? 's' : ''}`);
    }
    if (warranty.months > 0) {
      parts.push(`${warranty.months} month${warranty.months > 1 ? 's' : ''}`);
    }
    
    return parts.join(' ');
  }

  removeItem(id: number) {
    this.inventoryService.removePart(id);
  }

  toggleVisibility(id: number) {
    this.inventoryService.toggleVisibility(id);
  }
}