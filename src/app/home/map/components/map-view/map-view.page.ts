import { Component, Input, OnInit } from '@angular/core';
import { Geolocation, Position } from '@capacitor/geolocation';
import { ModalController, Platform } from '@ionic/angular';
import { Share } from '@capacitor/share';

import { debounceTime, Subject } from 'rxjs';

import { ETypeActionButton } from 'src/app/shared/types/type-action-button.type';
import { IBSDataFlow } from 'src/app/shared/interfaces/business-suggestion/business-suggestion.interface';
import { CameraService } from 'src/app/shared/services/camera.service';
import { BusinessSuggestionService } from 'src/app/shared/services/business-suggestion.service';
import { LocationMarker } from 'src/app/shared/interfaces/map/location.interface';
import { CategoryService } from 'src/app/shared/services/category.service';
import { CompanySeat } from 'src/app/shared/interfaces/company/company-seat.interface';
import { SeatService } from 'src/app/shared/services/seat.service';
import { BsSuggestCameraComponent } from '../../components/bs-create/bs-suggest-camera/bs-suggest-camera.component';
import { BsSuggestInformationStep1Component } from '../../components/bs-create/bs-suggest-information-step1/bs-suggest-information-step1.component';
import { BsSuggestInformationStep2Component } from '../../components/bs-create/bs-suggest-information-step2/bs-suggest-information-step2.component';
import { BsSuggestInformationStep3Component } from '../../components/bs-create/bs-suggest-information-step3/bs-suggest-information-step3.component';
import { BsSuggestInformationStep4Component } from '../../components/bs-create/bs-suggest-information-step4/bs-suggest-information-step4.component';
import { BsTabsComponent } from '../../components/bs-tabs/bs-tabs.component';
import { SeatListComponent } from '../../components/seat-list/seat-list.component';
import { SeatMarkerComponent } from '../seat-marker/seat-marker.component';
import { ModalInfoRestaurantComponent } from 'src/app/home/main/components/modal-info-restaurant/modal-info-restaurant.component';
import { SuggestionMarkerComponent } from '../suggestion-marker/suggestion-marker.component';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.page.html',
  styleUrls: ['./map-view.page.scss'],
})
export class MapViewPage implements OnInit {
  business = [
    { img: 'assets/images/stores.png', title: 'Negozi Fisici', url: '' },
    {
      img: 'assets/images/local-investment.png',
      title: 'Local Investing',
      url: '',
    },
    { img: 'assets/images/professional.png', title: 'Professionisti', url: '' },
    { img: 'assets/images/event.png', title: 'Eventi', url: '' },
  ];
  heightContainer = 0;
  dontShowMore = true;
  dataFlow: IBSDataFlow = {
    address: '',
    category: '',
    country: '',
    countryCode: '',
    description: '',
    email: '',
    name: '',
    owner: '',
    phoneNumber: '',
    pictureFile: undefined,
    pictureUrl: '',
    place: {},
  };
  eTypeActionButton = ETypeActionButton;

  position: Position = {} as Position;
  optionsPosition: PositionOptions = {
    maximumAge: 3000,
    timeout: 10000,
    enableHighAccuracy: true,
  };
  suggestionMarkersLocation: LocationMarker[] = [];
  categories: any = [];
  seats: CompanySeat[] = [];
  seatMarkersLocation: LocationMarker[] = [];
  categoryIds: string[] = [];
  keyword = '';
  inputSubject = new Subject<string>();
  @Input() showHeader = false;
  indexSearch = 0;
  isModalInfoOpen = false;
  @Input() returnModal = '';

  constructor(
    private platform: Platform,
    private modalController: ModalController,
    private categoryService: CategoryService,
    private cameraService: CameraService,
    private businessSuggestionService: BusinessSuggestionService,
    private seatService: SeatService
  ) {}

  ngOnInit() {
    const dontShowMore =
      localStorage.getItem('appPassaparola_dontShowMoreBusinessSuggestion') ||
      'false';

    this.dontShowMore = dontShowMore === 'true' ? false : true;

    this.getAllCategory();
    // this.onOpenSeatListModal();
    this.inputSubject.pipe(debounceTime(1000)).subscribe(() => {
      this.getSeats(this.categoryIds, this.keyword);
    });

    this.heighPage();
    this.platform.resize.subscribe(async () => {
      this.heighPage();
    });

    this.getLocation();
    this.getSuggestionsBussines();
    this.getSeats(this.categoryIds, this.keyword);
  }

  heighPage() {
    this.platform.ready().then(() => {
      this.heightContainer = this.platform.height();
    });
  }

  async shareApp() {
    const user = localStorage.getItem('appPassaparola_user');
    const url = user
      ? 'https://app-passaparola.web.app/sing-up?promoCode=' +
        JSON.parse(user).userID
      : 'https://app-passaparola.web.app/sing-up';
    const data = {
      title: 'Passaparola App',
      text: `Registrati su passaparola`,
      url,
      dialogTitle: 'Passaparola App',
    };
    await Share.share(data);
  }

  async onOpenCamera() {
    this.cameraService
      .getPhoto()
      .then(({ imageUrl, file }) => {
        this.dataFlow.pictureUrl = imageUrl!;
        this.dataFlow.pictureFile = file;

        this.onOpenModalBsSuggestInformationStep1();
      })
      .catch((err) => {
        console.error(err);
      });
  }

  async onOpenModalBsSuggestCamera() {
    this.dataFlow = {
      address: '',
      category: '',
      country: '',
      countryCode: '',
      description: '',
      email: '',
      name: '',
      owner: '',
      phoneNumber: '',
      pictureFile: undefined,
      pictureUrl: '',
      place: {},
    };

    if (this.dontShowMore) {
      const modal = await this.modalController.create({
        component: BsSuggestCameraComponent,
        cssClass: 'modal-75vh',
        backdropDismiss: true,
        componentProps: {},
      });
      await modal.present();

      const { data } = await modal.onWillDismiss();

      if (data?.pictureFile && data?.pictureUrl) {
        this.dataFlow.pictureUrl = data.pictureUrl;
        this.dataFlow.pictureFile = data.pictureFile;

        this.onOpenModalBsSuggestInformationStep1();
      }
    } else {
      await this.onOpenCamera();
    }
  }

  async onOpenModalBsSuggestInformationStep1() {
    const modal = await this.modalController.create({
      component: BsSuggestInformationStep1Component,
      cssClass: 'modal-full-screen',
      backdropDismiss: true,
      componentProps: { dataFlow: this.dataFlow },
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();

    if (data?.previousStep) {
      this.dataFlow = data.dataFlow;
      this.onOpenModalBsSuggestCamera();
    } else if (data?.nextStep) {
      this.dataFlow = data.dataFlow;
      this.onOpenModalBsSuggestInformationStep2();
    }
  }

  async onOpenModalBsSuggestInformationStep2() {
    const modal = await this.modalController.create({
      component: BsSuggestInformationStep2Component,
      cssClass: 'modal-full-screen',
      backdropDismiss: true,
      componentProps: { dataFlow: this.dataFlow },
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();

    if (data?.previousStep) {
      this.dataFlow = data.dataFlow;
      this.onOpenModalBsSuggestInformationStep1();
    } else if (data?.nextStep) {
      this.dataFlow = data.dataFlow;
      this.onOpenModalBsSuggestInformationStep3();
    }
  }

  async onOpenModalBsSuggestInformationStep3() {
    const modal = await this.modalController.create({
      component: BsSuggestInformationStep3Component,
      cssClass: 'modal-full-screen',
      backdropDismiss: true,
      componentProps: { dataFlow: this.dataFlow },
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();

    if (data?.previousStep) {
      this.dataFlow = data.dataFlow;
      this.onOpenModalBsSuggestInformationStep2();
    } else if (data?.nextStep) {
      this.dataFlow = data.dataFlow;
      this.onOpenModalBsSuggestInformationStep4();
    }
  }

  async onOpenModalBsSuggestInformationStep4() {
    const modal = await this.modalController.create({
      component: BsSuggestInformationStep4Component,
      cssClass: 'modal-full-screen',
      backdropDismiss: true,
      componentProps: { dataFlow: this.dataFlow },
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();

    if (data?.goToYourSuggestions) {
      this.onOpenModalBsTabs();
    }
  }

  async onOpenModalBsTabs() {
    const modal = await this.modalController.create({
      component: BsTabsComponent,
      cssClass: 'modal-full-screen',
      backdropDismiss: true,
      componentProps: { dataFlow: this.dataFlow },
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();

    if (data?.goToNewBS) {
      this.onOpenModalBsSuggestCamera();
    }
  }

  async getLocation() {
    this.position = await Geolocation.getCurrentPosition(this.optionsPosition);
  }

  async onOpenSeatListModal() {
    const modal = await this.modalController.create({
      component: SeatListComponent,
      cssClass: 'modal-95vh',
      backdropDismiss: true,
      componentProps: {
        categories: this.categories,
        seats: this.seats,
        position: {
          latitude: this.position.coords.latitude,
          longitude: this.position.coords.longitude,
        },
        returnModal: this.returnModal,
      },
      initialBreakpoint: 0.75,
      breakpoints: [0, 0.25, 0.5, 0.75, 0.85, 1],
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();

    if (data?.goToYourSuggestions) this.onOpenModalBsTabs();
  }

  getSuggestionsBussines() {
    this.businessSuggestionService
      .findAll({ status: 'active', filterUser: false, offset: 1, limit: 10000 })
      .subscribe({
        next: (response) => {
          this.suggestionMarkersLocation = response.data.map((suggestion) => {
            return {
              position: {
                lat: parseFloat(suggestion.latitude),
                lng: parseFloat(suggestion.longitude),
              },
              data: suggestion,
            };
          });
        },
      });
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
          this.seats = response;
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

  onInputChange(event: any) {
    this.keyword = event.target.value;
    this.inputSubject.next(this.keyword);
  }

  async openSeatModal(seat: any) {
    const modal = await this.modalController.create({
      component: SeatMarkerComponent,
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

    if (data?.goToYourSuggestions) this.onOpenModalBsTabs();
  }

  async openSuggestionModal(suggestion: any) {
    const modal = await this.modalController.create({
      component: SuggestionMarkerComponent,
      cssClass: 'modal-90vh',
      backdropDismiss: true,
      breakpoints: [0, 0.3, 0.4, 0.55, 0.6, 0.7, 0.8],
      initialBreakpoint: 0.55,
      componentProps: {
        suggestion,
        position: this.position,
      },
      mode: 'md',
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();

    if (data?.goToYourSuggestions) this.onOpenModalBsTabs();
  }

  // checkDistance() {
  //   this.seats = this.seats.filter((item) => {
  //     const distance = parseFloat(
  //       this.geolocationService
  //         .getDistance(
  //           parseFloat(item.latitude),
  //           parseFloat(item.longitude),
  //           this.position.coords.latitude,
  //           this.position.coords.longitude,
  //           'km'
  //         )
  //         .toFixed(2)
  //     );
  //     return distance < 15;
  //   });

  //   if (this.seats.length === 0 && this.indexSearch < 2) this.modalInfo();
  // }

  // async modalInfo() {
  //   if (this.isModalInfoOpen) return;

  //   this.isModalInfoOpen = true;

  //   const modal = await this.modalController.create({
  //     component: ModalInfoRestaurantComponent,
  //     componentProps: {},
  //   });

  //   modal.onDidDismiss().then(() => {
  //     this.isModalInfoOpen = false;
  //   });

  //   modal.present();
  // }
}
