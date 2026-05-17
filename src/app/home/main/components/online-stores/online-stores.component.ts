import { Component, OnDestroy, OnInit } from '@angular/core';

import { debounceTime, Subject }        from 'rxjs';
import { ICategory }                    from 'src/app/shared/interfaces/company/category.interface';

import { CompanySeat }                  from 'src/app/shared/interfaces/company/company-seat.interface';
import { GeoPointModel }                from 'src/app/shared/interfaces/map/GeoPoint';
import { CategoryService }              from 'src/app/shared/services/category.service';
import { GeolocationService }           from 'src/app/shared/services/geolocation.service';
import { SeatService }                  from 'src/app/shared/services/seat.service';
import { NavController }                from '@ionic/angular';

@Component({
  selector: 'app-online-stores-main',
  templateUrl: './online-stores.component.html',
  styleUrls: ['./online-stores.component.scss'],
})
export class OnlineStoresComponent implements OnInit, OnDestroy {
  categories: any = [];
  seats: CompanySeat[] = [];
  seatsFiltered: CompanySeat[] = [];
  categoryIds: string[] = [];
  keyword = '';
  offset = 0;
  limit = 7;
  inputSubject = new Subject<string>();
  coordinates: GeoPointModel[] = [];
  location: GeoPointModel = {} as GeoPointModel;

  constructor(
    private seatService: SeatService,
    private categoryService: CategoryService,
    private geolocationService: GeolocationService,
    private navController: NavController
  ) {}
  ngOnDestroy(): void {}

  ngOnInit() {
    this.getAllCategory();
    this.inputSubject.pipe(debounceTime(1000)).subscribe((value) => {
      this.filterSeatByCategories();
      this.seatsFiltered = this.filterSeatByKeyword(this.seatsFiltered, value);
    });
  }

  async ionViewDidEnter() {
    const location = await this.geolocationService.getLocation();
    if (location) {
      this.location = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
      };
    }
    this.keyword = '';
    this.offset = 0;
    this.seats = [];
    this.seatsFiltered = [];
    this.getSeats(this.categoryIds, this.keyword);
  }

  getSeats(categoryIds: string[] = [], keyword = '', event?: any) {
    this.seatService
      .findAll({
        offset: this.offset,
        limit: this.limit,
        categoryIds,
        keyword,
        type: 'ecommerce',
      })
      .subscribe({
        next: (response) => {
          this.keyword = '';
          if (response.length === 0) {
            if (event) {
              event.target.disabled = true;
              event.target.complete();
            }
            return;
          }
          this.seats.push(...response);
          if (event) {
            event.target.complete();
          }
          this.offset += 7;

          this.filterSeatByCategories();

          this.coordinates = this.geolocationService.getCoordintes(
            this.seatsFiltered
          );

          this.orderByLocation();
        },
      });
  }

  onCategorySelected(category: ICategory) {
    this.keyword = '';
    category.selected = !category.selected;
    const categoriesSeletected = this.categories.filter(
      (category: any) => category.selected
    );

    this.categoryIds = this.collectIds(categoriesSeletected, true);
    this.filterSeatByCategories();
  }

  collectIds(category: any, isArray: boolean) {
    let ids: any = [];
    if (isArray) {
      ids = category.map((category: any) => category.id);
      category.forEach((item: any) => {
        if (item.children && item.children.length > 0) {
          for (let child of item.children) {
            ids = ids.concat(this.collectIds(child, false));
          }
        }
      });
    } else {
      ids = [category.id];
      if (category.children && category.children.length > 0) {
        for (let child of category.children) {
          ids = ids.concat(this.collectIds(child, false));
        }
      }
    }

    return ids;
  }

  private getAllCategory() {
    this.categoryService.getAllWithChildren().subscribe({
      next: (categories: any) => {
        this.categories = categories.map((category: any) => {
          return {
            ...category,
            companyCategoryTranslation: category.companyCategoryTranslation[0],
            selected: false,
          };
        });
      },
    });
  }

  onIonInfinite(ev: any) {
    this.getSeats(this.categoryIds, this.keyword, ev);
  }

  filterSeatByCategories() {
    if (this.categoryIds.length === 0) {
      this.seatsFiltered = this.seats;
      return;
    }

    this.seatsFiltered = this.seats.filter((seat: any) => seat.categories);

    this.seatsFiltered = this.seatsFiltered.filter((seat: any) =>
      seat.categories.some((category: any) =>
        this.categoryIds.includes(category.id)
      )
    );
  }

  onInputChange(event: any) {
    this.keyword = event.target.value;
    this.inputSubject.next(this.keyword);
  }

  filterSeatByKeyword(value: any, arg: any) {
    const result = [];
    for (const seats of value) {
      if (seats.name!.toUpperCase().indexOf(arg.toUpperCase()) > -1) {
        result.push(seats);
      }
    }
    return result;
  }

  orderByLocation() {
    if (this.geolocationService.myLocation) {
      this.coordinates = this.geolocationService.orderListByLocation(
        this.coordinates,
        this.location
      );
      let seatsOrder: CompanySeat[] = [];
      let seatsWithout = this.seatsFiltered.filter(
        (seat) => !seat.latitude && !seat.longitude
      );

      this.coordinates.forEach((coordinate) => {
        this.seatsFiltered.forEach((seat) => {
          if (
            parseFloat(seat.latitude!) === coordinate.latitude &&
            parseFloat(seat.longitude!) === coordinate.longitude
          ) {
            seatsOrder.push(seat);
          }
        });
      });

      this.seatsFiltered = seatsOrder.concat(seatsWithout);
      this.seatsFiltered = this.seatsFiltered.filter(
        (item, index, self) => index === self.findIndex((t) => t.id === item.id)
      );
    }
  }

  goToStores() {
    this.navController.navigateRoot(['external-stores']);
  }
}
