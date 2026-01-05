import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatService } from '../../../../core/services/chat.service';

@Component({
  selector: 'app-chat-widget',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat-widget.component.html',
  styleUrls: ['./chat-widget.component.scss']
})
export class ChatWidgetComponent {
  isOpen = computed(() => this.chatService.isOpen());
  constructor(public chatService: ChatService) {}
  /*toggleChat() {
    this.isOpen = !this.isOpen;
  }*/
}
