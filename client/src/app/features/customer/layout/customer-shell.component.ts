import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './components/sidebar.component';
import { TopbarComponent } from './components/topbar.component';
import { ChatService } from '../../../core/services/chat.service';
import { ChatWidgetComponent } from './components/chat-widget.component';

@Component({
  standalone: true,
  selector: 'app-customer-shell',
  imports: [RouterOutlet, SidebarComponent, TopbarComponent, ChatWidgetComponent],
  templateUrl: './customer-shell.component.html',
  styleUrl: './customer-shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerShellComponent {
  constructor(public chatService: ChatService) {}

  openChat() {
    this.chatService.open();
  }
}
