import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminChatService } from '../../services/admin-chat.service';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss']
})
export class CustomerListComponent {
  constructor(public chat: AdminChatService) {}
}
