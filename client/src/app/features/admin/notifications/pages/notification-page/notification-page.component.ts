import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, NotificationItem } from '../../services/notification.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-notification-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification-page.component.html',
  styleUrls: ['./notification-page.component.scss']
})
export class NotificationPageComponent {
  private readonly notificationService = inject(NotificationService);
  readonly notifications$: Observable<NotificationItem[]> = this.notificationService.notifications$;

  onAccept(id: number) {
    console.log('Accepted:', id);
    this.notificationService.removeNotification(id);
  }

  onDecline(id: number) {
    console.log('Declined:', id);
    this.notificationService.removeNotification(id);
  }
}
