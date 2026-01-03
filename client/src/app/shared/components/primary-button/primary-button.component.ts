import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-primary-button',
  standalone: true,
  imports: [CommonModule],
  template: `<button class="primary" (click)="$event.stopPropagation(); $event.preventDefault(); onClick()"><ng-content></ng-content></button>`,
  styles: [`.primary{background:var(--primary-red);color:var(--pure-white);border:none;padding:10px 14px;border-radius:8px;cursor:pointer}`]
})
export class PrimaryButtonComponent {
  onClick(): void { /* placeholder for host listeners */ }
}
