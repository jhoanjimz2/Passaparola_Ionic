import { Component, Input, OnInit } from '@angular/core';
import { Share } from '@capacitor/share';
import { InAppBrowser } from '@capgo/inappbrowser';

import { SeatService } from 'src/app/shared/services/seat.service';
import { GeolocationService } from 'src/app/shared/services/geolocation.service';
import { GeoPointModel } from 'src/app/shared/interfaces/map/GeoPoint';
import { CompanySeat } from 'src/app/shared/interfaces/company/company-seat.interface';
import { TranslateService } from '@ngx-translate/core';
import { CountryService, CryptoService } from 'src/app/shared/services';
import { environment } from 'src/environments/environment';
import { ModalController, NavController, Platform } from '@ionic/angular';
import { Country } from 'src/app/shared/interfaces/country/country.interface';

@Component({
  selector: 'app-seat-list',
  templateUrl: './seat-list.component.html',
  styleUrls: ['./seat-list.component.scss'],
})
export class SeatListComponent implements OnInit {
  @Input() categories: any = [];

  @Input() seats: any[] = [];
  limit = 20;
  page = 0;
  dayName: string = '';
  coordinates: GeoPointModel[] = [];
  @Input() position: GeoPointModel = {} as GeoPointModel;
  isIos = false;
  countries: Country[] = [];
  @Input() returnModal: string = '';

  constructor(
    private seatService: SeatService,
    private geolocationService: GeolocationService,
    private translate: TranslateService,
    private cryptoService: CryptoService,
    private platform: Platform,
    private countryService: CountryService,
    private navController: NavController,
    private modalController: ModalController
  ) {
    const platforms = this.platform.platforms();
    if (platforms.includes('ios') && platforms.includes('capacitor'))
      this.isIos = true;
  }

  ngOnInit() {
    this.categories = this.categories.filter(
      (category: any) => category.selected === true
    );

    this.getCountries();
    this.getDay();
    // this.findAll();
    this.formatSeats();
  }

  formatSeats() {
    this.seats = this.seats.map((seat: any) => {
      let scheduleDay = seat.schedule.find(
        (s: any) => s.dayOfWeek.relation === this.dayName
      );

      let isOpen = false;
      let timeRange = { start: '', end: '' };

      if (scheduleDay) {
        isOpen = this.isCurrentTimeInRange(scheduleDay.schedule).isOpen;
        timeRange = this.isCurrentTimeInRange(scheduleDay.schedule).timeRange!;
      }

      return {
        ...seat,
        isOpen,
        closeAt: timeRange ? timeRange.end : '',
      };
    });
    this.coordinates = this.geolocationService.getCoordintes(this.seats);
    this.orderByLocation();
  }

  getCountries() {
    this.countryService.findAll().subscribe({
      next: (response) => {
        this.countries = response;
      },
    });
  }

  findAll() {
    this.seatService
      .findAll({
        offset: this.page,
        limit: this.limit,
        categoryIds: this.categories.map((category: any) => category.id),
        keyword: '',
      })
      .subscribe({
        next: (data) => {
          this.seats = data.map((seat: any) => {
            let scheduleDay = seat.schedule.find(
              (s: any) => s.dayOfWeek.relation === this.dayName
            );

            let isOpen = false;
            let timeRange = { start: '', end: '' };

            if (scheduleDay) {
              isOpen = this.isCurrentTimeInRange(scheduleDay.schedule).isOpen;
              timeRange = this.isCurrentTimeInRange(scheduleDay.schedule)
                .timeRange!;
            }

            return {
              ...seat,
              isOpen,
              closeAt: timeRange ? timeRange.end : '',
            };
          });
          this.page++;
          // this.coordinates = this.geolocationService.getCoordintes(this.seats);
          // this.orderByLocation();
        },
      });
  }

  getDay() {
    const days = [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
    ];

    const today = new Date();

    const dayIndex = today.getDay();

    this.dayName = days[dayIndex];
  }

  isCurrentTimeInRange(timeRanges: { start: string; end: string }[]) {
    const now = new Date();
    const currentHour = now.getHours().toString().padStart(2, '0');
    const currentMinutes = now.getMinutes().toString().padStart(2, '0');
    const currentTime = `${currentHour}:${currentMinutes}`;

    return {
      isOpen: timeRanges.some((range) => {
        return range.start <= currentTime && currentTime <= range.end;
      }),
      timeRange: timeRanges.find(
        (range) => range.start <= currentTime && currentTime <= range.end
      ),
    };
  }

  orderByLocation() {
    if (this.position) {
      this.coordinates = this.geolocationService.orderListByLocation(
        this.coordinates,
        this.position
      );
      let seatsOrder: CompanySeat[] = [];
      let seatsWithout = this.seats.filter(
        (seat) => !seat.latitude && !seat.longitude
      );

      this.coordinates.forEach((coordinate) => {
        this.seats.forEach((seat) => {
          if (
            parseFloat(seat.latitude!) === coordinate.latitude &&
            parseFloat(seat.longitude!) === coordinate.longitude
          ) {
            seatsOrder.push(seat);
          }
        });
      });

      this.seats = seatsOrder.concat(seatsWithout);
      this.seats = this.seats.filter(
        (item, index, self) => index === self.findIndex((t) => t.id === item.id)
      );

      const position = {
        coords: {
          latitude: this.position.latitude,
          longitude: this.position.longitude,
          accuracy: 0,
          altitude: 0,
        },
      };
      this.seats = this.seats.map((item) => {
        let distance = 0;
        if (item.latitude && item.longitude && this.position) {
          distance = parseFloat(
            this.geolocationService
              .getDistance(
                parseFloat(item.latitude),
                parseFloat(item.longitude),
                position.coords.latitude,
                position.coords.longitude,
                'km'
              )
              .toFixed(2)
          );
        }
        return {
          ...item,
          distance,
        };
      });
    }
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

  howToGet(seat: CompanySeat) {
    const location: GeoPointModel = {
      latitude: parseFloat(seat.latitude!),
      longitude: parseFloat(seat.longitude!),
    };
    this.geolocationService.howToGet(location);
  }

  async goToDetail(id: string) {
    this.navController.navigateForward(['pages/company/seat/modify', id], {
      queryParams: { detail: true, returnModal: this.returnModal },
    });
    let modal = await this.modalController.getTop();
    while (modal) {
      if (modal.id !== 'modalSplashScreen') {
        await this.modalController.dismiss();
      } else {
        break;
      }
      modal = await this.modalController.getTop();
    }
  }
}
