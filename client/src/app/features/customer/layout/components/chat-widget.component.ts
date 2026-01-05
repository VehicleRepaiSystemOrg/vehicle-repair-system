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
  // Make it public so the template can access it
  public chatService = inject(ChatService);

  // Keep the computed signal as-is
  isOpen = computed(() => this.chatService.isOpen());

  // Optional: you can also expose clean methods instead of direct service access
  // toggle() { this.chatService.toggle(); }
  // close() { this.chatService.close(); }
}