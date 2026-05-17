import { CommonModule }                        from '@angular/common';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { IonHeader, IonIcon, IonToolbar }      from '@ionic/angular/standalone';
import { ModalController, NavController }      from '@ionic/angular';
import { Subject, takeUntil }                  from 'rxjs';
import { JointlybuyService }                   from 'src/app/shared/services/jointlybuy.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonIcon,
    IonHeader,
    IonToolbar
  ]
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() backButton: boolean = true;
  @Input() modal: boolean = false;
  @Input() notification: boolean = true;

  hasUnreadNotifications = false;
  private destroy$ = new Subject<void>();

  constructor(
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private jointlybuyService: JointlybuyService
  ) {}

  ngOnInit() {
    this.jointlybuyService.hasUnreadNotifications()
      .pipe(takeUntil(this.destroy$))
      .subscribe(hasUnread => {
        this.hasUnreadNotifications = hasUnread;
      });
  }

  back() {
    if (this.modal) {
      this.modalCtrl.dismiss()
    }
    else {
      this.navCtrl.back()
    }
  }

  async openNotifications() {
    if (this.modal) {
      this.modalCtrl.dismiss()
      return;
    }
    const { NotificationsComponent } = await import('../notifications/notifications.component');

    const modal = await this.modalCtrl.create({
      component: NotificationsComponent
    });
    await modal.present();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
