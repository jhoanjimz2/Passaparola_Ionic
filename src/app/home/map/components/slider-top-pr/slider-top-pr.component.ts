import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { tap } from 'rxjs';
import { SeatService } from 'src/app/shared/services/seat.service';
import { SwiperOptions } from 'swiper/types';

@Component({
  selector: 'app-slider-top-pr',
  templateUrl: './slider-top-pr.component.html',
  styleUrls: ['./slider-top-pr.component.scss'],
})
export class SliderTopPrComponent implements OnInit {
  @ViewChild('swiperContainer') swiperContainerRef!: ElementRef;

  topPrProducts: any[] = [];

  offset = 0;

  hasMoreProducts = true;

  initialLimit = 10;
  loadMoreLimit = 10;

  swiperConfig: SwiperOptions = {
    slidesPerView: 2,
    freeMode: true,
    navigation: true,
    on: {
      reachEnd: () => this.onReachEnd(),
    },
  };

  constructor(
    private seatService: SeatService,
    private navController: NavController
  ) {}

  ngOnInit() {
    this.getNearestProducts({
      offset: this.offset.toString(),
      limit: this.initialLimit.toString(),
    });
  }

  getNearestProducts({ offset, limit } = { offset: '0', limit: '10' }) {
    this.seatService
      .findAllTopPR(limit, offset, '')
      .pipe(
        tap((seats) => {
          if (seats.length === 0) {
            this.hasMoreProducts = false;
          } else {
            this.topPrProducts = [...this.topPrProducts, ...seats];

            Object.assign(
              this.swiperContainerRef.nativeElement,
              this.swiperConfig
            );

            this.swiperContainerRef.nativeElement.initialize();
          }
        })
      )
      .subscribe();
  }

  onReachEnd() {
    if (this.hasMoreProducts) {
      this.offset += this.loadMoreLimit;

      this.getNearestProducts({
        offset: (this.offset++).toString(),
        limit: this.loadMoreLimit.toString(),
      });
    }
  }

  goSeatDetail(id: string) {
    this.navController.navigateForward(['/pages/company/seat/modify', id], {
      queryParams: { detail: true },
    });
  }
}
