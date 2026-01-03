import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgClass } from '@angular/common';

interface NotificationItem {
  id: number;
  title: string;
  message: string;
  timeAgo: string;
  type: 'success' | 'info' | 'warning';
}

@Component({
  standalone: true,
  selector: 'app-customer-notifications-page',
  imports: [NgClass], 
  templateUrl: './customer-notifications.page.html',
  styleUrl: './customer-notifications.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerNotificationsPageComponent {
  readonly notifications: NotificationItem[] = [
    {
      id: 1,
      title: 'Booking Confirmed',
      message: 'Your service booking has been confirmed. We will contact you soon.',
      timeAgo: '2 hours ago',
      type: 'success',
    },
    {
      id: 2,
      title: 'Service Update',
      message: 'Your vehicle is now in the inspection phase.',
      timeAgo: '1 day ago',
      type: 'info',
    },
    {
      id: 3,
      title: 'Payment Reminder',
      message: 'Your invoice for recent service is due in 3 days.',
      timeAgo: '2 days ago',
      type: 'warning',
    },
    {
      id: 4,
      title: 'Warranty Expiring',
      message: 'Your brake warranty expires in 30 days.',
      timeAgo: '1 week ago',
      type: 'warning',
    },
  ];

  markAsRead(notificationId: number): void {
    console.debug('[Notifications] Mark as read clicked for:', notificationId);
  }
}