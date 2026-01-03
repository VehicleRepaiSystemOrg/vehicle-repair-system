import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryItem } from 'src/app/features/admin/inventory/services/inventory.service';

@Component({
  selector: 'app-inventory-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inventory-table.component.html',
  styleUrls: ['./inventory-table.component.scss']
})
export class InventoryTableComponent {
  @Input() items: InventoryItem[] = [];
  @Output() edit = new EventEmitter<InventoryItem>();

  onEdit(item: InventoryItem) { this.edit.emit(item); }
}
