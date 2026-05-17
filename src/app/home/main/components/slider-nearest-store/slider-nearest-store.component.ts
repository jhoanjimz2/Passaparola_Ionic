import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Position }                                                   from '@capacitor/geolocation';
import { ModalController, NavController }                             from '@ionic/angular';
import { take, tap }                                                  from 'rxjs';
import { PhysicalBusinessComponent }                                  from 'src/app/home/map/pages/physical-business/physical-business.component';
import { CompanySeat }                                                from 'src/app/shared/interfaces/company/company-seat.interface';
import { GeoPointModel }                                              from 'src/app/shared/interfaces/map/GeoPoint';
import { UtilsService }                                               from 'src/app/shared/services';
import { GeolocationService }                                         from 'src/app/shared/services/geolocation.service';
import { SeatService }                                                from 'src/app/shared/services/seat.service';
import { SwiperOptions }                                              from 'swiper/types';

@Component({
  selector: 'app-slider-nearest-store',
  templateUrl: './slider-nearest-store.component.html',
  styleUrls: ['./slider-nearest-store.component.scss'],
})
export class SliderNearestStoreComponent implements OnInit, OnDestroy {
  @ViewChild('swiperContainer') swiperContainerRef!: ElementRef;

  position: Position = {} as Position;

  nearestProducts: any[] = [];

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

  coordinates: GeoPointModel[] = [];

  constructor(
    private seatService: SeatService,
    private geolocationService: GeolocationService,
    private utilsService: UtilsService,
    private navController: NavController,
    private modalController: ModalController
  ) {}
  ngOnDestroy(): void {}

  async ngOnInit() {
    this.getNearestProducts({
      offset: this.offset.toString(),
      limit: this.initialLimit.toString(),
    });
  }

  getNearestProducts({ offset, limit } = { offset: '0', limit: '10' }) {
    this.seatService
      .findAll({
        offset: offset,
        limit: limit,
        categoryIds: [],
        keyword: '',
        type: 'physical',
      })
      .pipe(
        take(1),
        tap(async (seats) => {
          if (
            !!this.swiperContainerRef &&
            !this.swiperContainerRef.nativeElement.init
          ) {
            Object.assign(
              this.swiperContainerRef.nativeElement,
              this.swiperConfig
            );

            this.swiperContainerRef.nativeElement.initialize();
          }

          if (seats.length === 0) {
            this.hasMoreProducts = false;
          } else {
            this.nearestProducts = [...this.nearestProducts, ...seats];

            this.position = await this.geolocationService.getLocation();
            this.nearestProducts = this.nearestProducts.map((item) => {
              let distance = 0;
              if (item.latitude && item.longitude && this.position) {
                distance = parseFloat(
                  this.geolocationService
                    .getDistance(
                      parseFloat(item.latitude),
                      parseFloat(item.longitude),
                      this.position.coords.latitude,
                      this.position.coords.longitude,
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

            this.nearestProducts = this.utilsService.sortByField(
              this.nearestProducts,
              'distance',
              true
            );
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
