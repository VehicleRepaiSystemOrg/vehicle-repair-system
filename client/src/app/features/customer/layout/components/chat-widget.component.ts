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
  private chatService = inject(ChatService);
  isOpen = computed(() => this.chatService.isOpen());

  public toggleChat() {  // assuming this is the handler; uncomment and use if needed
    // this.chatService.toggle(); or similar
  }
}