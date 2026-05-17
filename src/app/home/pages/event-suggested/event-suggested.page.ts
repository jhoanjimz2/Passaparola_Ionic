import { Component, ElementRef, OnInit, ViewChild }                  from '@angular/core';
import { ActivatedRoute }                                            from '@angular/router';
import { Browser }                                                   from '@capacitor/browser';
import { Position, Geolocation }                                     from '@capacitor/geolocation';
import { InAppBrowser }                                              from '@capgo/inappbrowser';
import { Platform }                                                  from '@ionic/angular';
import { TranslateService }                                          from '@ngx-translate/core';
import { switchMap }                                                 from 'rxjs';
import { AuthenticationService }                                     from 'src/app/core/service/authentication.service';
import { Country }                                                   from 'src/app/shared/interfaces/country/country.interface';
import { Events }                                                    from 'src/app/shared/interfaces/events/events';
import { GeoPointModel }                                             from 'src/app/shared/interfaces/map/GeoPoint';
import { User }                                                      from 'src/app/shared/interfaces/user/user.interface';
import { CountryService, CryptoService, EventsService, UserService } from 'src/app/shared/services';
import { GeolocationService }                                        from 'src/app/shared/services/geolocation.service';
import { environment }                                               from 'src/environments/environment';
import { SwiperOptions }                                             from 'swiper/types';

@Component({
  selector: 'app-event-suggested',
  templateUrl: './event-suggested.page.html',
  styleUrls: ['./event-suggested.page.scss'],
})
export class EventSuggestedPage implements OnInit {
  @ViewChild('swiper', { static: false }) swiperRef!: ElementRef;

  promoCode = '';
  user: User = {} as User;
  event!:Events;
  position: Position = {} as Position;
  promoCodeDecrypt = '';
  seatId = '';
  loading = true;
  countries: Country[] = [];
  distance = 0;
  swiperConfig: SwiperOptions = {
    slidesPerView: 2,
    spaceBetween: 10,
  };
  isIos = false;

  constructor(
    private platform: Platform,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private cryptoService: CryptoService,
    private countryService: CountryService,
    private userService: UserService,
    private authenticationService: AuthenticationService,
    private eventsService: EventsService,
    private geolocationService: GeolocationService
  ) {
    const platforms = this.platform.platforms();
    if (platforms.includes('ios') && platforms.includes('capacitor'))
      this.isIos = true;
  }


  async ngOnInit() {
    try {
      this.position = await Geolocation.getCurrentPosition({
        maximumAge: 3000,
        timeout: 10000,
        enableHighAccuracy: true,
      });
    } catch (error) {
      this.translate.instant('GENERAL.LOCATION_NOT_AVAIBLE');
    }
    this.route.queryParams.subscribe(async (params: any) => {
      const promoCode = params.promoCode;
      if (promoCode)
        this.promoCodeDecrypt = await this.cryptoService.decrypt(promoCode);

      this.seatId = params.id;

      if (this.promoCodeDecrypt && this.seatId) {
        this.authAndCheckData(this.promoCodeDecrypt);
      } else {
        this.register();
      }
    });
  }

  authAndCheckData(promoCode: string) {
    this.loading = true;
    this.authenticationService.basicAuth()
      .pipe(() => {return this.countryService.findAll()})
      .pipe(switchMap((countries) => {
        this.countries = countries;
        return this.userService.checkPromoCode(promoCode);
      }))
      .pipe(switchMap((promoCodeResponse) => {
        this.user = promoCodeResponse;
        this.promoCode = promoCode;
        return this.eventsService.getEventToId(this.seatId);
      }))
      .subscribe({
        next: (event: Events) => {
          this.event = event;
          if (event.latitude && event.longitude && this.position) {
            this.distance = parseFloat(
              this.geolocationService
                .getDistance(
                  parseFloat(event.latitude),
                  parseFloat(event.longitude),
                  this.position.coords.latitude,
                  this.position.coords.longitude,
                  'km'
                )
                .toFixed(2)
            );
          }
        },
        error: () => this.register(),
        complete: () => {
          this.loading = false;
          setTimeout(() => {
            Object.assign(this.swiperRef.nativeElement, this.swiperConfig);
            this.swiperRef.nativeElement.initialize();
          },100)
        }
      });
  }
  async register() {
    const url = this.promoCode
      ? `${environment.urlRegister}/sing-up?promoCode=${this.promoCode}`
      : `${environment.urlRegister}/sing-up`;

    await Browser.open({ url });
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

}
