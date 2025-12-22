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
  // TODO (backend): Replace mock data with API call
  // GET /customer/notifications - Fetch all notifications for the logged-in customer
  // Expected response: Array of { id, title, message, timeAgo, type, isRead }
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


  // TODO (backend): Implement mark as read functionality
  // PUT /customer/notifications/:notificationId/read - Mark a single notification as read
  markAsRead(notificationId: number): void {
    // TODO (backend): Call API to mark notification as read, then update local state
    console.debug('[Notifications] Mark as read clicked for:', notificationId);
  }

  // TODO (backend): Implement mark all as read functionality
  // PUT /customer/notifications/read-all - Mark all notifications as read
  markAllAsRead(): void {
    // TODO (backend): Call API to mark all notifications as read, then refresh the list
    console.debug('[Notifications] Mark all as read clicked');
  }
}
