import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Browser } from '@capacitor/browser';
import { Position, Geolocation } from '@capacitor/geolocation';

import { InAppBrowser } from '@capgo/inappbrowser';
import { TranslateService } from '@ngx-translate/core';
import { switchMap } from 'rxjs';

import { AuthenticationService } from 'src/app/core/service/authentication.service';
import { CompanySeat } from 'src/app/shared/interfaces/company/company-seat.interface';
import { Company } from 'src/app/shared/interfaces/company/company.interface';
import { Country } from 'src/app/shared/interfaces/country/country.interface';
import { User } from 'src/app/shared/interfaces/user/user.interface';
import {
  CountryService,
  CryptoService,
  UserService,
} from 'src/app/shared/services';
import { GeolocationService } from 'src/app/shared/services/geolocation.service';
import { SeatService } from 'src/app/shared/services/seat.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-suggested',
  templateUrl: './suggested.page.html',
  styleUrls: ['./suggested.page.scss'],
})
export class SuggestedPage implements OnInit {
  promoCode = '';
  seatId = '';
  user: User | Company | any = {} as User;
  promoCodeDecrypt = '';
  seat: CompanySeat = {} as CompanySeat;
  category = '';
  loading = true;
  position: Position = {} as Position;
  distance = 0;
  isIos = false;
  countries: Country[] = [];

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private cryptoService: CryptoService,
    private authenticationService: AuthenticationService,
    private seatService: SeatService,
    private geolocationService: GeolocationService,
    private countryService: CountryService,
    private translate: TranslateService
  ) {}

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
    this.authenticationService
      .basicAuth()
      .pipe(() => {
        return this.countryService.findAll();
      })
      .pipe(
        switchMap((countries) => {
          this.countries = countries;
          return this.userService.checkPromoCode(promoCode);
        })
      )
      .pipe(
        switchMap((promoCodeResponse) => {
          this.user = promoCodeResponse;
          this.promoCode = promoCode;
          return this.seatService.findOneSuggested(this.seatId);
        })
      )
      .subscribe({
        next: (seat) => {
          this.seat = seat;
          if (this.seat.categories.length > 0) {
            this.category = (
              this.seat as any
            ).categories[0].companyCategoryTranslation.description;
          }

          if (seat.latitude && seat.longitude && this.position) {
            this.distance = parseFloat(
              this.geolocationService
                .getDistance(
                  parseFloat(seat.latitude),
                  parseFloat(seat.longitude),
                  this.position.coords.latitude,
                  this.position.coords.longitude,
                  'km'
                )
                .toFixed(2)
            );
          }
        },
        error: () => this.register(),
        complete: () => (this.loading = false),
      });
  }

  async register() {
    const url = this.promoCode
      ? `${environment.urlRegister}/sing-up?promoCode=${this.promoCode}`
      : `${environment.urlRegister}/sing-up`;

    await Browser.open({ url });
  }

  async callPhoneNumber() {
    const contry = this.countries.find(
      (data: any) => data.code === this.seat?.countryCode
    );
    const prefix = contry ? contry.phonePrefix : '';

    if (this.isIos) {
      InAppBrowser.open({ url: `tel:${prefix}${this.seat.phone}` });
    } else {
      window.open(`tel:${prefix}${this.seat.phone}`);
    }
  }
}
