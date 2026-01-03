import { Component, Input } from '@angular/core'; // 1. Must import Input
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stat-card.component.html',
  styleUrls: ['./stat-card.component.scss']
})
export class StatCardComponent {
  @Input() label = '';  // 2. Add this
  @Input() value = '';  // 3. Add this
}