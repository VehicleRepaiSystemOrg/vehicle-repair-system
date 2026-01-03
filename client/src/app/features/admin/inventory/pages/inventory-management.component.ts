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

  removeItem(id: number) {
    this.inventoryService.removePart(id);
  }
}