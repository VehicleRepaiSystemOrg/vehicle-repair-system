import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminChatService } from '../../services/admin-chat.service';

@Component({
  selector: 'app-chat-window',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.scss']
})
export class ChatWindowComponent {
  constructor(public chat: AdminChatService) {}
}
