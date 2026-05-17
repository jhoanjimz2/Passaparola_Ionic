import { Component, OnDestroy }                    from '@angular/core';
import { Geolocation, Position }                   from '@capacitor/geolocation';
import { ModalController }                         from '@ionic/angular';
import { CompanySeat }                             from 'src/app/shared/interfaces/company/company-seat.interface';
import { LocationMarker }                          from 'src/app/shared/interfaces/map/location.interface';
import { CategoryService }                         from 'src/app/shared/services/category.service';
import { SeatService }                             from 'src/app/shared/services/seat.service';
import { StoreViewComponent }                      from '../store-view/store-view.component';
import { IonChip, IonContent, IonIcon }            from '@ionic/angular/standalone';
import { CommonModule }                            from '@angular/common';
import { ComponentModule }                         from 'src/app/components/component.module';

@Component({
  selector: 'app-select-store-tag',
  templateUrl: './select-store-tag.component.html',
  styleUrls: ['./select-store-tag.component.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonIcon,
    IonChip,
    CommonModule,
    ComponentModule
  ]
})
export class SelectStoreTagComponent implements OnDestroy{

  position: Position = {} as Position;
  optionsPosition: PositionOptions = {
    maximumAge: 3000,
    timeout: 10000,
    enableHighAccuracy: true,
  };

  suggestionMarkersLocation: LocationMarker[] = [];
  seatMarkersLocation: LocationMarker[] = [];

  categories: any[] = [];

  categoryIds: string[] = [];
  keyword = '';

  constructor(
    private categoryService: CategoryService,
    private seatService: SeatService,
    private modalController: ModalController
  ) {
    this.getAllCategory();
    this.getLocation();
    this.getSeats(this.categoryIds, this.keyword);
  }
  ngOnDestroy(): void {
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

  async getLocation() {
    this.position = await Geolocation.getCurrentPosition(this.optionsPosition);
  }

  getSeats(categoryIds: string[] = [], keyword = '') {
    this.seatService
      .findAll({
        offset: 0,
        limit: 100000,
        categoryIds,
        keyword,
        type: 'physical',
      })
      .subscribe({
        next: (response) => {
          // this.seats = response;
          this.seatMarkersLocation = response.map((seat: CompanySeat) => {
            return {
              position: {
                lat: parseFloat(seat.latitude!),
                lng: parseFloat(seat.longitude!),
              },
              data: seat,
            };
          });

          this.seatMarkersLocation = this.seatMarkersLocation.filter(
            (seat) => seat.position.lat && seat.position.lng
          );
        },
      });
  }

  onCategorySelected(category: any) {
    category.selected = !category.selected;
    const categoriesSeletected = this.categories.filter(
      (category: any) => category.selected
    );

    this.categoryIds = this.collectIds(categoriesSeletected, true);

    this.getSeats(this.categoryIds, this.keyword);
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

  async openSeatModal(seat: any) {
    const modal = await this.modalController.create({
      component: StoreViewComponent,
      cssClass: 'modal-90vh',
      backdropDismiss: true,
      breakpoints: [0, 0.3, 0.45, 0.5, 0.6, 0.7, 0.8],
      initialBreakpoint: 0.5,
      componentProps: {
        seat,
        position: this.position,
      },
      mode: 'md',
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();

    if (data.seat) {
      setTimeout(() => {
        this.modalController.dismiss({
          seat: data.seat
        })
      },500)
    }
  }

}
