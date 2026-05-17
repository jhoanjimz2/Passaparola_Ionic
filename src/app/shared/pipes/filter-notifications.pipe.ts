import { Pipe, PipeTransform }                                            from '@angular/core';
import { Notification, NotificationType, WishbuyWillbuyNotificationType } from 'src/app/shared/interfaces/jointlybuy/notifications';

@Pipe({
  name: 'filterNotifications',
  standalone: true,
  pure: true
})
export class FilterNotificationsPipe implements PipeTransform {

  transform(
    notifications: Notification[] | null | undefined,
    notificationType: NotificationType,
    wishbuyWillbuyType: WishbuyWillbuyNotificationType
  ): Notification[] {

    if (!notifications?.length) {
      return [];
    }

    return notifications.filter(notification =>
      this.matchesNotificationType(notification, notificationType) &&
      this.matchesSubtype(notification, wishbuyWillbuyType, notificationType)
    );
  }

  private matchesNotificationType(
    notification: Notification,
    type: NotificationType
  ): boolean {
    // Para willbuyManaged, mostrar solo Wishbuy con estado 'newState' (aprobados)
    if (type === NotificationType.willbuyManaged) {
      return notification.type === NotificationType.wishbuy &&
             notification.wishbuyWillbuyNotificationType === WishbuyWillbuyNotificationType.newState;
    }

    return type === NotificationType.all || notification.type === type;
  }

  private matchesSubtype(
    notification: Notification,
    subtype: WishbuyWillbuyNotificationType,
    notificationType: NotificationType
  ): boolean {
    // Para willbuyManaged no aplicar filtros de subtipo (ya están filtrados como aprobados)
    if (notificationType === NotificationType.willbuyManaged) {
      return true;
    }

    // Para otros tipos, aplicar el filtro de subtipo normalmente
    return subtype === WishbuyWillbuyNotificationType.all ||
           notification.wishbuyWillbuyNotificationType === subtype;
  }
}
