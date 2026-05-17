import { Component, ElementRef, Input, OnDestroy, ViewChild }                  from '@angular/core';
import { ModalController, Platform }                                           from '@ionic/angular';
import { PayTicketComponent }                                                  from '../pay-ticket/pay-ticket.component';
import { SeatNameComponent }                                                   from '../seat/seat-name/seat-name.component';
import { SeatLocationComponent }                                               from '../seat/seat-location/seat-location.component';
import { SeatDescriptionComponent }                                            from '../seat/seat-description/seat-description.component';
import { SeatTagsComponent }                                                   from '../seat/seat-tags/seat-tags.component';
import { SeatGalleryComponent }                                                from '../seat/seat-gallery/seat-gallery.component';
import { SeatInfoComponent }                                                   from '../seat/seat-info/seat-info.component';
import { SeatScheduleComponent }                                               from '../seat/seat-schedule/seat-schedule.component';
import { SeatCategoryComponent }                                               from '../seat/seat-category/seat-category.component';
import { SeatServiceComponent }                                                from '../seat/seat-service/seat-service.component';
import { Events, Product, Rule }                                               from 'src/app/shared/interfaces/events/events';
import { CountryService, CryptoService, EventsService }                        from 'src/app/shared/services';
import { EventPublishComponent }                                               from '../event-publish/event-publish.component';
import { SeatGreenComponent }                                                  from '../seat/seat-green/seat-green.component';
import { Subscription }                                                        from 'rxjs';
import { SeatTicketsViewComponent }                                            from '../seat/seat-tickets-view/seat-tickets-view.component';
import { SeatViewImageComponent }                                              from '../seat/seat-view-image/seat-view-image.component';
import { SeatViewStatsComponent }                                              from '../seat/seat-view-stats/seat-view-stats.component';
import { PayTicketExtraComponent }                                             from '../pay-ticket-extra/pay-ticket-extra.component';
import { environment }                                                         from 'src/environments/environment';
import { Share }                                                               from '@capacitor/share';
import { TranslateService }                                                    from '@ngx-translate/core';
import { Country }                                                             from 'src/app/shared/interfaces/country/country.interface';
import { InAppBrowser }                                                        from '@capgo/inappbrowser';
import { GeoPointModel }                                                       from 'src/app/shared/interfaces/map/GeoPoint';
import { GeolocationService }                                                  from 'src/app/shared/services/geolocation.service';

@Component({
  selector: 'app-event-profile',
  templateUrl: './event-profile.component.html',
  styleUrls: ['./event-profile.component.scss'],
})
export class EventProfileComponent implements OnDestroy {
  @ViewChild('textContainer', { static: false }) textContainer!: ElementRef;
  imgGallery: string = '';
  isModalOpen: boolean = false;

  @Input() edit:    boolean = false;
  @Input() stats:   boolean = false;
  @Input() create:  boolean = false;
  @Input() preview: boolean = false;

  get updating():boolean { return ((this.edit || this.create) && !this.preview) }
  get view():boolean { return ((!this.edit && !this.create) || this.preview)}

  private subscription!: Subscription;
  eventProfile: Events = {} as Events;

  verMas: boolean = false;
  isTextOverflowing: boolean = false;
  resizeObserver!: ResizeObserver;

  countries: Country[] = [];
  isIos = false;

  distacia = 0;

  constructor(
    private platform: Platform,
    private modalController: ModalController,
    private eventsService: EventsService,
    private cryptoService: CryptoService,
    private translate: TranslateService,
    private countryService: CountryService,
    private geolocationService: GeolocationService
  ) {
    this.subscription = this.eventsService.obtenerEventSelect().subscribe({
      next: (events) => { this.eventProfile = events; }
    });
    const platforms = this.platform.platforms();

    if (platforms.includes('ios') && platforms.includes('capacitor'))
      this.isIos = true;

    this.getCountries();
    this.distance()
  }
  ngAfterViewInit() {
    this.checkOverflow();
    this.initResizeObserver();
  }
  toggleVerMas() {
    this.verMas = !this.verMas;
  }
  checkOverflow() {
    setTimeout(() => {
      if (this.textContainer) {
        const element = this.textContainer.nativeElement;
        this.isTextOverflowing = element.scrollHeight > element.clientHeight;
      }
    }, 0);
  }
  initResizeObserver() {
    if (this.textContainer) {
      this.resizeObserver = new ResizeObserver(() => this.checkOverflow());
      this.resizeObserver.observe(this.textContainer.nativeElement);
    }
  }
  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }
  close() {
    this.modalController.dismiss();
  }
  getCountries() {
    this.countryService.findAll().subscribe({
      next: (response) => {
        this.countries = response;
      },
    });
  }
  async seatOpenViewImage(imgGallery: string) {
    const modal = await this.modalController.create({
      component: SeatViewImageComponent,
      cssClass: 'bg-transp',
      componentProps: { imgGallery }
    });
    modal.present();
  }
  openTypeModal(type: string) {
    switch (type) {
      case 'ticket':
        this.openSeatTickets();
        break;
      case 'category':
        this.openSeatCategory();
        break;
    }
  }
  async openSeatCategory() {
    const modal = await this.modalController.create({
      component: SeatCategoryComponent,
      cssClass: ['radius-modals', 'modal-95vh'],
      breakpoints: [0,1],
      initialBreakpoint: 1,
    });
    modal.present();
  }
  async openSeatNameComponent() {
    const modal = await this.modalController.create({
      component: SeatNameComponent,
      cssClass: ['radius-modals', 'modal-60vh'],
      breakpoints: [0,1],
      initialBreakpoint: 1,
    });
    modal.present();
  }
  async openSeatScheduleComponent() {
    const modal = await this.modalController.create({
      component: SeatScheduleComponent,
      cssClass: ['radius-modals', 'modal-95vh'],
      breakpoints: [0,1],
      initialBreakpoint: 1,
    });
    modal.present();
  }
  async openSeatLocationComponent() {
    if (this.view) return;
    const modal = await this.modalController.create({
      component: SeatLocationComponent,
      componentProps: {
        address: this.eventProfile.address,
        latitude: this.eventProfile.latitude,
        longitude: this.eventProfile.longitude,
        webAddress: this.eventProfile.webAddress,
      },
      cssClass: ['radius-modals', 'modal-75vh'],
      breakpoints: [0,1],
      initialBreakpoint: 1,
    });

    await modal.present();
    const { data } = await modal.onWillDismiss();

    if(data?.data) {
      this.eventProfile.webAddress = data.webAddress;
      this.eventProfile.longitude  = data.longitude;
      this.eventProfile.latitude   = data.latitude;
      this.eventProfile.address    = data.address;
      this.distance();
    }
  }
  async openSeatDescriptionComponent() {
    const modal = await this.modalController.create({
      component: SeatDescriptionComponent,
      cssClass: ['radius-modals', 'modal-60vh'],
      breakpoints: [0,1],
      initialBreakpoint: 1,
    });
    await modal.present();
    this.checkOverflow();
    this.initResizeObserver();
  }
  async openSeatTagsComponent() {
    const modal = await this.modalController.create({
      component: SeatTagsComponent,
      cssClass: ['radius-modals', 'modal-95vh'],
      breakpoints: [0,1],
      initialBreakpoint: 1,
    });
    modal.present();
  }
  async openSeatGalleryComponent(showDetail: boolean) {
    const modal = await this.modalController.create({
      component: SeatGalleryComponent,
      componentProps: { showDetail },
      cssClass: ['radius-modals', 'modal-60vh'],
      breakpoints: [0,1],
      initialBreakpoint: 1,
    });
    modal.present();
  }
  async openSeatInfoComponent(index?: number) {
    let existingRule = index !== undefined ? this.eventProfile.rules![index] : null;

    const modal = await this.modalController.create({
      component: SeatInfoComponent,
      componentProps: { ruleData: existingRule },
      cssClass: ['radius-modals', 'modal-60vh'],
      breakpoints: [0,1],
      initialBreakpoint: 1,
    });

    await modal.present();
    const { data } = await modal.onWillDismiss();

    if (data?.deleteId) {
      this.eventsService.deletRuleEventToId(data?.deleteId).subscribe({
        next: () => {
          this.eventProfile.rules = this.eventProfile.rules?.filter(rule => rule.id !== data.deleteId);
        }
      })
    } else if (data) {
      if (data.id) {
        const ruleIndex = this.eventProfile.rules!.findIndex(r => r.id === data.id);
        if (ruleIndex !== -1) {
          this.eventsService.createRuleEvent([{...data}]).subscribe({
            next: (_data: Rule[]) => {
              this.eventProfile.rules![ruleIndex] = _data[0];
            }
          })
        }
      } else {
        let { id, ...create } = data;
        this.eventsService.createRuleEvent([{...create}]).subscribe({
          next: (_data: Rule[]) => {
            this.eventProfile.rules?.push(_data[0]);
          }
        })
      }
    }
  }
  async openSeatServiceComponent(index?: number) {
    if (this.view) return;
    let existingProduct = index !== undefined ? this.eventProfile.products![index] : null;
    const modal = await this.modalController.create({
      component: SeatServiceComponent,
      componentProps: {
        product: existingProduct,
        idProduct: existingProduct?.id
      },
      cssClass: ['radius-modals', 'modal-95vh'],
      breakpoints: [0,1],
      initialBreakpoint: 1,
    });
    modal.present();
  }
  async openPublishEvent() {
    const modal = await this.modalController.create({
      component: EventPublishComponent,
      cssClass: ['radius-modals', 'modal-95vh'],
      breakpoints: [0,1],
      initialBreakpoint: 1,
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data) {
      this.eventsService.publicEvent(this.eventProfile.id!).subscribe({
        next: () => this.modalController.dismiss()
      })
    }

  }
  async openSeatGreenComponent() {
    if (this.view) return;
    const modal = await this.modalController.create({
      component: SeatGreenComponent,
      cssClass: ['radius-modals', 'modal-60vh'],
      breakpoints: [0,1],
      initialBreakpoint: 1,
    });
    modal.present();
  }
  async openSeatTickets() {
    const modal = await this.modalController.create({
      component: SeatTicketsViewComponent,
      cssClass: ['radius-modals', 'modal-95vh'],
      breakpoints: [0,1],
      initialBreakpoint: 1,
    });
    modal.present();
  }
  async openStats() {
    const modal = await this.modalController.create({
      component: SeatViewStatsComponent,
      componentProps: {
        id: this.eventProfile.id
      },
      cssClass: ['radius-modals', 'modal-95vh'],
      breakpoints: [0,1],
      initialBreakpoint: 1,
    });
    modal.present();
  }
  async openPayTicket() {
    const modal = await this.modalController.create({
      component: PayTicketComponent,
      cssClass: ['radius-modals', 'modal-60vh'],
      breakpoints: [0,1],
      initialBreakpoint: 1,
    });
    modal.present();
  }
  async openPayTicketExtra(product: Product) {
    const modal = await this.modalController.create({
      component: PayTicketExtraComponent,
      componentProps: { product },
      cssClass: ['radius-modals', 'modal-60vh'],
      breakpoints: [0,1],
      initialBreakpoint: 1,
    });
    modal.present();
  }


  async suggestionSeat(event: Events) {
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

  async callPhoneNumber(seat: Events) {
    const contry = this.countries.find(
      (data: any) => data.code === seat.company?.countryCode
    );
    const prefix = contry ? contry.phonePrefix : '';

    if (this.isIos) {
      InAppBrowser.open({ url: `tel:${prefix}${seat.company?.phoneNumber}` });
    } else {
      window.open(`tel:${prefix}${seat.company?.phoneNumber}`);
    }
  }

  howToGet(seat: Events) {
    const location: GeoPointModel = {
      latitude: parseFloat(seat.latitude!),
      longitude: parseFloat(seat.longitude!),
    };
    this.geolocationService.howToGet(location);
  }

  async distance() {
    let position = await this.geolocationService.getLocation();
    this.distacia = parseFloat(
      this.geolocationService.getDistance(
        parseFloat(this.eventProfile.latitude!),
        parseFloat(this.eventProfile.longitude!),
        position.coords.latitude,
        position.coords.longitude,
        'km'
      ).toFixed(2)
    );
  }
}
