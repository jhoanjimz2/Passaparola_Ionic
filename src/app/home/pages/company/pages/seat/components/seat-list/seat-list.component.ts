import { Component, EventEmitter, Input, Output }      from '@angular/core';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { SeatMessageNoVisibleComponent }               from '../seat-message-no-visible/seat-message-no-visible.component';
import { SeatSecurityComponent }                       from '../seat-security/seat-security.component';
import { TranslateModule }                             from '@ngx-translate/core';
import { CommonModule }                                from '@angular/common';
import { PipesModule }                                 from 'src/app/shared/pipes/pipes.module';
import { SessionService }                              from 'src/app/shared/services/session.service';

@Component({
  selector: 'app-seat-list',
  templateUrl: './seat-list.component.html',
  styleUrls: ['./seat-list.component.scss'],
  standalone: true,
  imports: [TranslateModule, CommonModule, IonicModule, PipesModule],
})
export class SeatListComponent {
  @Input() infiniteScrollEnabled = false;
  @Input() seatList: any[] = [];

  @Output() onFindAll: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private modalController: ModalController,
    private navCtrl: NavController,
    public sessionService: SessionService
  ) {}

  async ngOnInit() {}

  findAll(event?: any) {
    this.onFindAll.emit(event);
  }

  onModify(seat: any) {
    if (seat.isVisible) {
      this.goToModify(seat.id);
    } else {
      this.onOpenModalSeatMessageNoVisible(seat.id);
    }
  }

  goToModify(id: string) {
    this.navCtrl.navigateForward(['/pages/company/seat/modify', id]);
  }

  async onOpenModalSeatMessageNoVisible(id: string) {
    const modal = await this.modalController.create({
      component: SeatMessageNoVisibleComponent,
      cssClass: 'modal-60vh',
      backdropDismiss: true,
      componentProps: {},
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();

    if (data?.goToModify) this.goToModify(id);
  }

  async onOpenModalSeatSecurity(seat: any) {
    const modal = await this.modalController.create({
      component: SeatSecurityComponent,
      cssClass: 'modal-full-screen',
      backdropDismiss: true,
      componentProps: {
        seat: seat,
      },
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    this.findAll();
  }
}
