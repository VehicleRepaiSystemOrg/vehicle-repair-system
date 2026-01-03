import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alert-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert-badge.component.html',
  styleUrls: ['./alert-badge.component.scss']
})
export class AlertBadgeComponent {
  @Input() count = 0;
}
