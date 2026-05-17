import { Component, OnDestroy }                                           from '@angular/core';
import { IonContent }                                                     from "@ionic/angular/standalone";
import { HeaderComponent }                                                from '../header/header.component';
import { CommonModule }                                                   from '@angular/common';
import { NotificationComponent }                                          from '../notification/notification.component';
import { JointlybuyService }                                              from 'src/app/shared/services/jointlybuy.service';
import { Subscription }                                                   from 'rxjs';
import { Notification, NotificationType, WishbuyWillbuyNotificationType } from 'src/app/shared/interfaces/jointlybuy/notifications';
import { FilterNotificationsPipe }                                        from 'src/app/shared/pipes/filter-notifications.pipe';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
  standalone: true,
  imports: [
    IonContent,
    HeaderComponent,
    CommonModule,
    NotificationComponent,
    FilterNotificationsPipe
  ]
})
export class NotificationsComponent implements OnDestroy {

  readonly notificationType = NotificationType;
  readonly wishbuyWillbuyNotificationType = WishbuyWillbuyNotificationType;
  typeNotification: NotificationType = NotificationType.willbuyManaged;
  typeWishbuyWillbuyNotification: WishbuyWillbuyNotificationType = WishbuyWillbuyNotificationType.all;
  notifications: Notification[] = [];

  private subscription?: Subscription;

  constructor(private jointlybuyService: JointlybuyService) {
    this.loadNotifications();
  }

  private loadNotifications(): void {
    this.subscription = this.jointlybuyService.allNotification().subscribe({
      next: (notifications) => {
        console.log(notifications)
        this.notifications = notifications;
      },
      error: (error) => {
        console.error('Error loading notifications:', error);
      }
    });
  }

  changeNotificationType(type: NotificationType): void {
    this.typeNotification = type;
    this.typeWishbuyWillbuyNotification = WishbuyWillbuyNotificationType.all;
  }

  changeSubtype(subtype: WishbuyWillbuyNotificationType): void {
    this.typeWishbuyWillbuyNotification = subtype;
  }

  /**
   * Determina si se deben mostrar los filtros secundarios
   * Los filtros NO se muestran para willbuyManaged (Wishbuy aprobados)
   */
  shouldShowFilters(): boolean {
    return this.typeNotification === NotificationType.willbuyInvestes ||
           this.typeNotification === NotificationType.wishbuy;
  }

  trackByNotificationId(index: number, notification: Notification): string {
    return notification.id || index.toString();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
