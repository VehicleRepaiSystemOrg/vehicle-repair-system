import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerListComponent } from '../components/customer-list/customer-list.component';
import { ChatWindowComponent } from '../components/chat-window/chat-window.component';

@Component({
  selector: 'app-admin-messages',
  standalone: true,
  imports: [CommonModule, CustomerListComponent, ChatWindowComponent],
  templateUrl: './admin-messages.page.html',
  styleUrls: ['./admin-messages.page.scss']
})
export class AdminMessagesPage {}
