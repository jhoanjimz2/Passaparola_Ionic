import { Component, Input, OnInit } from '@angular/core';
import { InAppBrowser } from '@capgo/inappbrowser';
import { NavController, Platform, ModalController } from '@ionic/angular';
import { Share } from '@capacitor/share';
import { Position } from '@capacitor/geolocation';

import { TranslateService } from '@ngx-translate/core';

import { CompanySeat } from 'src/app/shared/interfaces/company/company-seat.interface';
import { GeoPointModel } from 'src/app/shared/interfaces/map/GeoPoint';
import { CountryService, CryptoService } from 'src/app/shared/services';
import { GeolocationService } from 'src/app/shared/services/geolocation.service';
import { environment } from 'src/environments/environment';
import { Country } from 'src/app/shared/interfaces/country/country.interface';

@Component({
  selector: 'app-physical-business-card',
  templateUrl: './physical-business-card.component.html',
  styleUrls: ['./physical-business-card.component.scss'],
})
export class PhysicalBusinessCardComponent implements OnInit {
  @Input({ required: true }) item: any;
  countries: Country[] = [];
  isIos = false;
  distance = 0;
  @Input() position: Position = {} as Position;

  constructor(
    private platform: Platform,
    private geolocationService: GeolocationService,
    private translate: TranslateService,
    private cryptoService: CryptoService,
    private countryService: CountryService,
    private navController: NavController,
    private modalController: ModalController
  ) {
    const platforms = this.platform.platforms();
    if (platforms.includes('ios') && platforms.includes('capacitor'))
      this.isIos = true;
  }

  async ngOnInit() {
    this.getCountries();
    if (this.item.latitude && this.item.longitude && this.position) {
      this.distance = parseFloat(
        this.geolocationService
          .getDistance(
            parseFloat(this.item.latitude),
            parseFloat(this.item.longitude),
            this.position.coords.latitude,
            this.position.coords.longitude,
            'km'
          )
          .toFixed(2)
      );
    }
  }

  howToGet(seat: CompanySeat) {
    const location: GeoPointModel = {
      latitude: parseFloat(seat.latitude!),
      longitude: parseFloat(seat.longitude!),
    };
    this.geolocationService.howToGet(location);
  }

  async suggestionSeat(seat: CompanySeat) {
    const user = localStorage.getItem('appPassaparola_user');
    const userIdEncrypt = this.cryptoService.encrypt(JSON.parse(user!).userID);
    const url = `${environment.urlPWA}/pages/suggested?promoCode=${userIdEncrypt}&id=${seat.id}`;

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

  async callPhoneNumber(seat: CompanySeat) {
    const contry = this.countries.find(
      (data: any) => data.code === seat?.countryCode
    );
    const prefix = contry ? contry.phonePrefix : '';

    if (this.isIos) {
      InAppBrowser.open({ url: `tel:${prefix}${seat.phone}` });
    } else {
      window.open(`tel:${prefix}${seat.phone}`);
    }
  }

  getCountries() {
    this.countryService.findAll().subscribe({
      next: (response) => {
        this.countries = response;
      },
    });
  }

  goSeatDetail() {
    this.modalController.dismiss();
    this.navController.navigateForward(
      ['/pages/company/seat/modify', this.item.id],
      {
        queryParams: { detail: true, returnModal: 'PhysicalBusinessComponent' },
      }
    );
  }
}
