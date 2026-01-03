import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { map, Observable } from 'rxjs';
// THE FIXED PATH: Go up one level to 'admin', then into 'inventory'
import { InventoryService, InventoryItem } from '../inventory/services/inventory.service';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent {
  private readonly inventoryService = inject(InventoryService);

  // 1. Explicitly type the Observable as InventoryItem[]
  readonly parts$: Observable<InventoryItem[]> = this.inventoryService.parts$.pipe(
    // 2. Define 'items' as InventoryItem[] to solve the 'unknown' error
    map((items: InventoryItem[]) => {
      // 3. Define 'item' as InventoryItem to solve the 'any' error
      return items.filter((item: InventoryItem) => {
        const stockCount = Number(item.stock ?? 0);
        return stockCount > 0;
      });
    })
  );
}