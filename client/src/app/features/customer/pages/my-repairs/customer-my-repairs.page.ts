import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-customer-my-repairs-page',
  imports: [CommonModule, RouterLink],
  templateUrl: './customer-my-repairs.page.html',
  styleUrl: './customer-my-repairs.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerMyRepairsPageComponent {
  // Logic for fetching repairs would go here
}