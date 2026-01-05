import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './components/sidebar.component';
import { TopbarComponent } from './components/topbar.component';
import { ChatWidgetComponent } from './components/chat-widget.component';
import { ChatService } from 'src/app/core/services/chat.service';

@Component({
  standalone: true,
  selector: 'app-customer-shell',
  imports: [RouterOutlet, SidebarComponent, TopbarComponent, ChatWidgetComponent],
  templateUrl: './customer-shell.component.html',
  styleUrl: './customer-shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerShellComponent {
  public chatService = inject(ChatService);

  openChat() {
    this.chatService.open();
  }
}