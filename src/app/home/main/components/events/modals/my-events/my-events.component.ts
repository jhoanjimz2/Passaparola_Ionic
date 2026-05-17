import { Component, OnDestroy } from '@angular/core';
import { EventProfileComponent } from '../event-profile/event-profile.component';
import { ModalController } from '@ionic/angular';
import { QrCodeEventComponent } from '../qr-code-event/qr-code-event.component';
import { Events } from 'src/app/shared/interfaces/events/events';
import { Subscription } from 'rxjs';
import { CryptoService, EventsService } from 'src/app/shared/services';
import { environment } from 'src/environments/environment';
import { Share } from '@capacitor/share';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-my-events',
  templateUrl: './my-events.component.html',
  styleUrls: ['./my-events.component.scss'],
})
export class MyEventsComponent implements OnDestroy {
  private subscription!: Subscription;
  myEventsTickets: Events[] = [];

  isLoadingCover: boolean = true;
  isLoadingPicture: boolean = true;

  constructor(
    private modalController: ModalController,
    private eventsService: EventsService,
    private cryptoService: CryptoService,
    private translate: TranslateService
  ) {
    this.subscription = this.eventsService.obtenerMyEventsTickets().subscribe({
      next: (events) => {
        this.myEventsTickets = events;
      },
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }

  onImageLoadCover() {
    this.isLoadingCover = false;
  }
  onImageLoadPicture() {
    this.isLoadingPicture = false;
  }

  onImageErrorCover(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/images/events/custom-icons/noimage.svg';
    this.isLoadingCover = false;
  }
  onImageErrorPicture(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/images/events/custom-icons/noimage.svg';
    this.isLoadingPicture = false;
  }

  loadEventToId(event: Events) {
    this.eventsService.getEventToId(event.id!).subscribe({
      next: (data) => {
        this.eventsService.setEventoCompleto(data);
        this.openProfileEvent();
      },
    });
  }

  async openProfileEvent() {
    const modal = await this.modalController.create({
      component: EventProfileComponent,
      componentProps: { create: false, stats: false },
    });
    modal.present();
  }

  async openQrCodeEvenet(event: Events) {
    const modal = await this.modalController.create({
      component: QrCodeEventComponent,
      componentProps: { event },
    });
    modal.present();
  }

  async suggestionSeat(event: Events, state: string, date: string) {
    if (state != 'active' || date == 'expired') return;
    const user = localStorage.getItem('appPassaparola_user');
    const userIdEncrypt = this.cryptoService.encrypt(JSON.parse(user!).userID);
    const url = `${environment.urlPWA}/pages/event-suggested?promoCode=${userIdEncrypt}&id=${event.id}`;

    const data = {
      title: 'Passaparola App',
      text: `${this.translate.instant(
        'GENERAL.SUGGESTION.TEXT_1'
      )}\n${this.translate.instant(
        'GENERAL.SUGGESTION.TEXT_2'
      )}\n${this.translate.instant('GENERAL.SUGGESTION.TEXT_3')}`,
      url,
      dialogTitle: 'Passaparola App',
    };
    await Share.share(data);
  }

  handleRefresh(event: any) {
    this.eventsService.reloadDataEvents('all');
    setTimeout(() => event.target.complete(), 100);
  }
}
