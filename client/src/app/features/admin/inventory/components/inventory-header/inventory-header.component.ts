import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-inventory-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inventory-header.component.html',
  styleUrls: ['./inventory-header.component.scss']
})
export class InventoryHeaderComponent {
  query = '';
  @Output() searchTerm = new EventEmitter<string>();
  @Output() addRequested = new EventEmitter<void>();

  onSearch() { this.searchTerm.emit(this.query); }
  onAdd() { this.addRequested.emit(); }
}
