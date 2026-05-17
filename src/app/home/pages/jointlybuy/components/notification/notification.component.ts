import { CommonModule }                                                  from '@angular/common';
import { Component, Input }                                              from '@angular/core';
import { ModalController, NavController }                                from '@ionic/angular';
import { Notification, WishbuyWillbuyNotificationType }                  from 'src/app/shared/interfaces/jointlybuy/notifications';
import { JointlybuyService }                                             from 'src/app/shared/services/jointlybuy.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  standalone: true,
  imports: [
    CommonModule
  ]
})
export class NotificationComponent {
  @Input() notification: Notification = {} as Notification;

  readonly wishbuyWillbuyNotificationType = WishbuyWillbuyNotificationType;

  constructor(
    private jointlybuyService: JointlybuyService,
    private navCtrl: NavController,
    private modalCtrl: ModalController
  ) {}

  getBorderModifier(): string {
    const type = this.notification.wishbuyWillbuyNotificationType;

    if (type === WishbuyWillbuyNotificationType.newState) {
      return 'notification--accepted';
    }

    if (type === WishbuyWillbuyNotificationType.rejected) {
      return 'notification--rejected';
    }

    return '';
  }
  getProductImage(): string {
    return this.notification.payload?.willbuy?.product?.pictureUrlFile ||
           'https://placehold.co/50x50?text=notification';
  }

  viewNotification() {
    if (!this.notification.isRead) {
      this.jointlybuyService.updateNotification({
        ...this.notification, isRead: true
      }, this.notification.id!).subscribe()
    }

    if (this.notification.wishbuyWillbuyNotificationType != WishbuyWillbuyNotificationType.rejected) {
      this.modalCtrl.dismiss()
      this.navCtrl.navigateForward(['/pages/jointlybuy/view-willbuy', this.notification.payload?.id], {
        queryParams: { public: false }
      });
    }
  }
}
