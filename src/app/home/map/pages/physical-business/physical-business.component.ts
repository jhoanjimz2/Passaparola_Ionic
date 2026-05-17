import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { InfiniteScrollCustomEvent, ModalController }  from '@ionic/angular';
import { Geolocation, Position }                       from '@capacitor/geolocation';

import {
  debounceTime,
  distinctUntilChanged,
  finalize,
  Subject,
  tap,
} from 'rxjs';

import { CategoryService }                             from 'src/app/shared/services/category.service';
import { SeatService }                                 from 'src/app/shared/services/seat.service';
import { GeolocationService }                          from 'src/app/shared/services/geolocation.service';
import { ModalInfoRestaurantComponent }                from 'src/app/home/main/components/modal-info-restaurant/modal-info-restaurant.component';

@Component({
  selector: 'app-physical-business',
  templateUrl: './physical-business.component.html',
  styleUrls: ['./physical-business.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PhysicalBusinessComponent implements OnInit {
  @Input() categoryId = undefined;
  @Input() category = '';
  categories: any[] = [];
  items: any[] = [];
  offset: number = 0;
  limit: number = 10;
  keyword: string = '';
  categoryIds: string[] = [];
  hasMoreItems: boolean = true;
  private searchSubject: Subject<string> = new Subject();
  position: Position = {} as Position;
  isModalInfoOpen = false;
  indexSearch = 0;

  constructor(
    private seatService: SeatService,
    private categoryService: CategoryService,
    private geolocationService: GeolocationService,
    private modalController: ModalController
  ) {}

  async ngOnInit() {
    try {
      this.position = await Geolocation.getCurrentPosition({
        maximumAge: 3000,
        timeout: 10000,
        enableHighAccuracy: true,
      });
    } catch (error) {
      console.error(error);
    }
    this.loadItems();
    this.getAllCategory();
    this.searchSubject
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((keyword) => {
        this.keyword = keyword;
        this.resetItems();
      });
  }

  private loadItems(ev?: any) {
    this.seatService
      .findAll({
        limit: this.limit,
        offset: this.offset,
        isSuggested: false,
        categoryIds: this.categoryIds,
        keyword: this.keyword,
        type: 'physical',
      })
      .pipe(
        tap((response) => {
          this.indexSearch++;
          if (ev) {
            if (response.length < this.limit) {
              this.hasMoreItems = false;
            }
            this.items = [...this.items, ...response];
            this.offset += this.limit;
          } else {
            this.items = response;
            this.offset = this.limit;
            this.hasMoreItems = response.length === this.limit;
          }

          if (this.categoryId) {
            const items = this.items.filter((item) => {
              const distance = parseFloat(
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
              return distance < 50;
            });

            if (items.length === 0 && this.indexSearch < 2) this.modalInfo();
          }
        }),
        finalize(() => {
          (ev as InfiniteScrollCustomEvent)?.target?.complete();
        })
      )
      .subscribe();
  }

  private generateItems(ev: any) {
    if (!this.hasMoreItems) {
      (ev as InfiniteScrollCustomEvent)?.target?.complete();
      return;
    }
    this.loadItems(ev);
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

        if (this.categoryId) {
          this.onCategorySelected({}, this.categoryId);
        }
      },
    });
  }

  onCategorySelected(category: any, id?: string) {
    this.keyword = '';

    if (id) {
      category = this.categories.find((item) => item.id === id);
    }

    category.selected = !category.selected;

    const categoriesSeletected = this.categories.filter(
      (category: any) => category.selected
    );

    this.categoryIds = this.collectIds(categoriesSeletected, true);

    this.resetItems();
  }

  onSearch(event: any) {
    this.searchSubject.next(event.value);
  }

  private resetItems() {
    this.items = [];
    this.offset = 0;
    this.hasMoreItems = true;
    this.loadItems();
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

  onIonInfinite(ev: any) {
    this.generateItems(ev);
  }

  async modalInfo() {
    if (this.isModalInfoOpen) return;

    this.isModalInfoOpen = true;

    const modal = await this.modalController.create({
      component: ModalInfoRestaurantComponent,
      componentProps: {
        category: this.category,
      },
    });

    modal.onDidDismiss().then(() => {
      this.isModalInfoOpen = false;
    });

    modal.present();
  }
}
