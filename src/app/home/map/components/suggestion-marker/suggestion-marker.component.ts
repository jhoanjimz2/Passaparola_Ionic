import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Position } from '@capacitor/geolocation';
import { Share } from '@capacitor/share';

import { TranslateService } from '@ngx-translate/core';

import { CompanySeat } from 'src/app/shared/interfaces/company/company-seat.interface';
import { GeoPointModel } from 'src/app/shared/interfaces/map/GeoPoint';
import { CryptoService } from 'src/app/shared/services';
import { BusinessSuggestionService } from 'src/app/shared/services/business-suggestion.service';
import { GeolocationService } from 'src/app/shared/services/geolocation.service';
import { environment } from 'src/environments/environment';
import { BusinessSuggestionVote } from '../../../../shared/interfaces/business-suggestion/business-suggestion-vte.interface';

@Component({
  selector: 'app-suggestion-marker',
  templateUrl: './suggestion-marker.component.html',
  styleUrls: ['./suggestion-marker.component.scss'],
})
export class SuggestionMarkerComponent implements OnInit {
  @Input() suggestion: any;
  dayName: string = '';
  distance = 0;
  @Input() position: Position = {} as Position;
  votes: BusinessSuggestionVote[] = [];
  businessSuggestionVote: BusinessSuggestionVote | undefined;

  constructor(
    private cryptoService: CryptoService,
    private translate: TranslateService,
    private geolocationService: GeolocationService,
    private businessSuggestionService: BusinessSuggestionService
  ) {}

  ngOnInit() {
    // this.getDay();
    this.getVotes();

    // let scheduleDay = this.seat.schedule.find(
    //   (s: any) => s.dayOfWeek.relation === this.dayName
    // );

    // let isOpen = false;
    // let timeRange = { start: '', end: '' };

    // if (scheduleDay) {
    //   isOpen = this.isCurrentTimeInRange(scheduleDay.schedule).isOpen;
    //   timeRange = this.isCurrentTimeInRange(scheduleDay.schedule).timeRange!;
    // }

    // this.seat = {
    //   ...this.seat,
    //   isOpen,
    //   closeAt: timeRange ? timeRange.end : '',
    // };

    this.distance = parseFloat(
      this.geolocationService
        .getDistance(
          parseFloat(this.suggestion.latitude!),
          parseFloat(this.suggestion.longitude!),
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

  vote() {
    this.businessSuggestionService
      .vote({
        status: true,
        businessSuggestion: this.suggestion,
      })
      .subscribe({
        next: (response) => {
          this.businessSuggestionVote = response;
          this.votes.push(response);
        },
      });
  }

  getVotes() {
    this.businessSuggestionService
      .findAllVotes({
        offset: 0,
        limit: 1000000,
        id: this.suggestion.id,
        filterUser: false,
      })
      .subscribe({
        next: (response) => {
          this.votes = response;

          const user = JSON.parse(localStorage.getItem('appPassaparola_user')!);
          let vote = undefined;
          if (user.rol === 'company') {
            vote = this.votes.find(
              (vote) =>
                vote.company?.userID ===
                JSON.parse(localStorage.getItem('appPassaparola_user')!).userID
            );
          } else {
            vote = this.votes.find(
              (vote) =>
                vote.user?.userID ===
                JSON.parse(localStorage.getItem('appPassaparola_user')!).userID
            );
          }

          this.businessSuggestionVote = vote ? vote : undefined;
        },
      });
  }
}
