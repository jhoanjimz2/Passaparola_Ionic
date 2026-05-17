import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Share } from '@capacitor/share';
import { InAppBrowser } from '@capgo/inappbrowser';
import {
  InfiniteScrollCustomEvent,
  ModalController,
  NavController,
  Platform,
} from '@ionic/angular';

import { TranslateService } from '@ngx-translate/core';
import { PhysicalBusinessComponent } from 'src/app/home/map/pages/physical-business/physical-business.component';

import { CompanySeat } from 'src/app/shared/interfaces/company/company-seat.interface';
import { Country } from 'src/app/shared/interfaces/country/country.interface';
import { GeoPointModel } from 'src/app/shared/interfaces/map/GeoPoint';
import { CountryService, CryptoService } from 'src/app/shared/services';
import { GeolocationService } from 'src/app/shared/services/geolocation.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-recommendation',
  templateUrl: './recommendation.component.html',
  styleUrls: ['./recommendation.component.scss'],
})
export class RecommendationComponent implements OnInit {
  @Input({ required: true }) items: any[] = [];
  @Output() onIonInfinite: EventEmitter<any> = new EventEmitter<any>();
  isIos = false;
  countries: Country[] = [];

  constructor(
    private platform: Platform,
    private cryptoService: CryptoService,
    private translate: TranslateService,
    private countryService: CountryService,
    private navController: NavController,
    private geolocationService: GeolocationService,
    private modalController: ModalController
  ) {
    const platforms = this.platform.platforms();

    if (platforms.includes('ios') && platforms.includes('capacitor'))
      this.isIos = true;
  }
  ngOnDestroy(): void {}

  ngOnInit() {
    this.getCountries();
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
  onSetEventIonInfinite(event: any) {
    this.onIonInfinite.emit(event);
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

  getCountries() {
    this.countryService.findAll().subscribe({
      next: (response) => {
        this.countries = response;
      },
    });
  }

  goSeatDetail(id: string) {
    this.navController.navigateForward(['/pages/company/seat/modify', id], {
      queryParams: { detail: true },
    });
  }

  howToGet(seat: CompanySeat) {
    const location: GeoPointModel = {
      latitude: parseFloat(seat.latitude!),
      longitude: parseFloat(seat.longitude!),
    };
    this.geolocationService.howToGet(location);
  }

  async goToAll() {
    const modal = await this.modalController.create({
      component: PhysicalBusinessComponent,
    });

    modal.present();
  }
}
