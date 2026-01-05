import { Component, computed, inject } from '@angular/core';
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
  public chatService = inject(ChatService);

  isOpen = computed(() => this.chatService.isOpen());

  toggleChat() {
    this.chatService.toggle();   // or whatever method your ChatService uses to toggle
    // If your service has separate open()/close(), you can do:
    // this.chatService.isOpen() ? this.chatService.close() : this.chatService.open();
  }
}