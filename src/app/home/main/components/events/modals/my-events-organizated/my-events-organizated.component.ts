import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ScanQrComponent } from 'src/app/components/scan-qr/scan-qr.component';
import { EventProfileComponent } from '../event-profile/event-profile.component';
import { QrCodeScanedComponent } from '../qr-code-scaned/qr-code-scaned.component';
import { CryptoService, EventsService } from 'src/app/shared/services';
import { Events, StateEvent } from 'src/app/shared/interfaces/events/events';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { Share } from '@capacitor/share';

@Component({
  selector: 'app-my-events-organizated',
  templateUrl: './my-events-organizated.component.html',
  styleUrls: ['./my-events-organizated.component.scss'],
  animations: [
    trigger('filterAnimation', [
      state(
        'selected',
        style({
          transform: 'scale(1.1)',
          opacity: 1,
        })
      ),
      state(
        'deselected',
        style({
          transform: 'scale(1)',
          opacity: 0.8,
        })
      ),
      transition('deselected => selected', [animate('200ms ease-in-out')]),
      transition('selected => deselected', [animate('200ms ease-in-out')]),
    ]),
  ],
})
export class MyEventsOrganizatedComponent {
  myEvents: Events[] = [];
  allState: StateEvent[] = [];

  isModalOpenQr = false;
  isLoadingCover: boolean = true;
  isLoadingPicture: boolean = true;

  filterSelect: StateEvent = {} as StateEvent;

  constructor(
    private modalController: ModalController,
    private eventsService: EventsService,
    private cryptoService: CryptoService,
    private translate: TranslateService
  ) {
    this.eventsService.obtenerMyEvents().subscribe({
      next: (events) => {
        this.myEvents = events;
      },
    });
    this.eventsService.obtenerAllState().subscribe({
      next: (state: StateEvent[]) => {
        this.allState = state;
      },
    });
  }

  selectFilter(filter: StateEvent) {
    if (this.filterSelect.id == filter.id) this.filterSelect = {} as StateEvent;
    else if (!this.filterSelect || this.filterSelect.id != filter.id)
      this.filterSelect = filter;
    this.eventsService
      .getMyEventsCreateFilters({
        filter: this.filterSelect?.id ? this.filterSelect.description : 'all',
        keyword: '',
      })
      .subscribe();
  }

  handleRefresh(event: any) {
    this.eventsService.reloadDataEvents(
      this.filterSelect?.id ? this.filterSelect.description : 'all'
    );
    setTimeout(() => event.target.complete(), 100);
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

  createEvent() {
    this.eventsService.createEvent().subscribe({
      next: (data) => {
        this.eventsService.setEventoCompleto(data);
        this.openModalEditEvent();
      },
    });
  }

  loadEventToId(event: Events) {
    this.eventsService.getEventToId(event.id!).subscribe({
      next: (data) => {
        this.eventsService.setEventoCompleto(data);
        if (['inactive', 'rejected'].includes(event.processStatus!)) {
          this.openModalEditEvent();
        } else {
          this.openProfileEvent();
        }
      },
    });
  }

  async openProfileEvent() {
    const modal = await this.modalController.create({
      component: EventProfileComponent,
      componentProps: { stats: true },
      backdropDismiss: true,
    });
    await modal.present();
  }

  async openModalEditEvent() {
    const modal = await this.modalController.create({
      component: EventProfileComponent,
      componentProps: { edit: true, stats: false },
      backdropDismiss: true,
    });
    await modal.present();
  }

  async modalQrScan() {
    if (this.isModalOpenQr) return;

    this.isModalOpenQr = true;

    const modal = await this.modalController.create({
      component: ScanQrComponent,
      backdropDismiss: true,
      componentProps: {},
      id: 'ScanQrComponent',
    });

    modal.onDidDismiss().then(() => {
      this.isModalOpenQr = false;
    });

    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data?.qrValue) this.checkTicket(data.qrValue);
  }

  checkTicket(id: string) {
    this.eventsService.getCheckTicket(id).subscribe({
      next: (data: any) => {
        this.openQrCodeScaned(data);
      },
      error: (error: any) => {
        console.error(error);
      },
    });
  }

  async openQrCodeScaned(ticket: any) {
    const modal = await this.modalController.create({
      component: QrCodeScanedComponent,
      componentProps: { ticket },
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
}
