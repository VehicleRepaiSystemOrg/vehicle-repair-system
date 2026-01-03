import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Column { key: string; label: string }

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent {
  @Input() columns: Column[] = [];
  @Input() rows: Record<string, unknown>[] = [];

  @Output() edit = new EventEmitter<Record<string, unknown>>();

  onEdit(row: Record<string, unknown>) {
    this.edit.emit(row);
  }
}
