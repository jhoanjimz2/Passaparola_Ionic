import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Position } from '@capacitor/geolocation';
import { Share } from '@capacitor/share';
import { ModalController, NavController } from '@ionic/angular';

import { TranslateService } from '@ngx-translate/core';

import { CompanySeat } from 'src/app/shared/interfaces/company/company-seat.interface';
import { GeoPointModel } from 'src/app/shared/interfaces/map/GeoPoint';
import { CryptoService } from 'src/app/shared/services';
import { GeolocationService } from 'src/app/shared/services/geolocation.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-seat-marker',
  templateUrl: './seat-marker.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeatMarkerComponent implements OnInit {
  @Input() seat: any;
  dayName: string = '';
  distance = 0;
  @Input() position: Position = {} as Position;

  constructor(
    private cryptoService: CryptoService,
    private translate: TranslateService,
    private geolocationService: GeolocationService,
    private navController: NavController,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.getDay();

    let scheduleDay = this.seat.schedule.find(
      (s: any) => s.dayOfWeek.relation === this.dayName
    );

    let isOpen = false;
    let timeRange = { start: '', end: '' };

    if (scheduleDay) {
      isOpen = this.isCurrentTimeInRange(scheduleDay.schedule).isOpen;
      timeRange = this.isCurrentTimeInRange(scheduleDay.schedule).timeRange!;
    }

    this.seat = {
      ...this.seat,
      isOpen,
      closeAt: timeRange ? timeRange.end : '',
    };

    this.distance = parseFloat(
      this.geolocationService
        .getDistance(
          parseFloat(this.seat.latitude!),
          parseFloat(this.seat.longitude!),
          this.position.coords.latitude,
          this.position.coords.longitude,
          'km'
        )
        .toFixed(2)
    );
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

  howToGet(seat: CompanySeat) {
    const location: GeoPointModel = {
      latitude: parseFloat(seat.latitude!),
      longitude: parseFloat(seat.longitude!),
    };

    this.geolocationService.howToGet(location);
  }

  goToDetail() {
    this.modalController.dismiss();
    this.navController.navigateForward(
      ['pages/company/seat/modify', this.seat.id],
      {
        queryParams: { detail: true },
      }
    );
  }
}
