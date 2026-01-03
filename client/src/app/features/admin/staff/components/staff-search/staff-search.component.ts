import { FormsModule } from '@angular/forms';
import { Component, EventEmitter ,Output } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-staff-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './staff-search.component.html',
  styleUrls: ['./staff-search.component.scss']
})
export class StaffSearchComponent {
  query = '';
  @Output() searchTerm = new EventEmitter<string>();

  onSearch() { this.searchTerm.emit(this.query); }
}
