import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-add-employee-button',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './add-employee-button.component.html',
  styleUrls: ['./add-employee-button.component.scss']
})
export class AddEmployeeButtonComponent {
  @Output() add = new EventEmitter<void>();
}
