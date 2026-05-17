import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ModalController, NavController }      from '@ionic/angular';
import { TranslateService }                    from '@ngx-translate/core';
import { PhysicalBusinessComponent }           from 'src/app/home/map/pages/physical-business/physical-business.component';
import { ProfesionalsPageComponent }           from 'src/app/home/map/pages/profesionals/profesionals.component';
import { FormDoctorsComponent }                from '../form-doctors/form-doctors.component';

// Interfaz para la configuración de navegación
interface NavigationConfig {
  type: 'modal' | 'url';
  component?: any;
  componentProps?: Record<string, any>;
  url?: string;
}

// Interfaz mejorada para las categorías
interface Category {
  img: string;
  title: string;
  navigation?: NavigationConfig;
}

@Component({
  selector: 'app-slider-categories',
  templateUrl: './slider-categories.component.html',
  styleUrls: ['./slider-categories.component.scss'],
})
export class SliderCategoriesComponent implements OnInit {
  @Input() disabled = false;

  private readonly categories: Category[] = [
    {
      img: 'assets/images/jointlybuy/jointlybuy.png',
      title: "Gruppi d'acquisto",
      navigation: {
        type: 'url',
        url: 'pages/jointlybuy'
      }
    },
    {
      img: 'assets/images/event.png',
      title: 'MAP_PAGE.CATEGORIES.EVENT',
      navigation: {
        type: 'url',
        url: 'pages/events'
      }
    },
    {
      img: 'assets/images/event.png',
      title: 'Casa e giardino',
      navigation: {
        type: 'url',
        url: 'pages/house-garden'
      }
    },
    {
      img: 'assets/images/categories/Ristoranti.png',
      title: 'Ristoranti',
      navigation: {
        type: 'modal',
        component: PhysicalBusinessComponent,
        componentProps: {
          categoryId: '3d4f1d0b-57b2-4cbb-b7e0-3d0ff19b4952',
          category: 'Ristoranti'
        }
      }
    },
    {
      img: 'assets/images/categories/Bar-Caffetterie.png',
      title: 'Bar/Caffetterie',
      navigation: {
        type: 'modal',
        component: PhysicalBusinessComponent,
        componentProps: {
          categoryId: '3d4f1d0b-57b2-4cbb-b7e0-3d0ff19b4952',
          category: 'Bar/Caffetterie'
        }
      }
    },
    {
      img: 'assets/images/categories/Dottori.png',
      title: 'Dottori',
      navigation: {
        type: 'modal',
        component: FormDoctorsComponent
      }
    },
    {
      img: 'assets/images/categories/Pet.png',
      title: 'Pet',
      navigation: {
        type: 'modal',
        component: PhysicalBusinessComponent,
        componentProps: {
          categoryId: 'a87b7196-0dbe-4673-b26c-0f3a4612d7e4',
          category: 'Pet'
        }
      }
    },
    {
      img: 'assets/images/categories/Negozi_fisici.png',
      title: 'MAP_PAGE.CATEGORIES.PHYSYCS',
      navigation: {
        type: 'modal',
        component: PhysicalBusinessComponent
      }
    },
    {
      img: 'assets/images/categories/Farmacie.png',
      title: 'Farmacie',
      navigation: {
        type: 'modal',
        component: PhysicalBusinessComponent,
        componentProps: {
          categoryId: '48987963-8138-4b4a-b24a-4fa659649b6c',
          category: 'Farmacie'
        }
      }
    },
    {
      img: 'assets/images/local-investment.png',
      title: 'MAP_PAGE.CATEGORIES.LOCAL',
      navigation: {
        type: 'modal',
        component: ProfesionalsPageComponent,
        componentProps: {}
      }
    },
    {
      img: 'assets/images/professional.png',
      title: 'MAP_PAGE.CATEGORIES.PROFESIONALS',
      navigation: {
        type: 'modal',
        component: ProfesionalsPageComponent,
        componentProps: {}
      }
    }
  ];

  categoriesTranslates: Category[] = [];

  selectedIndex = 1;
  @ViewChild('swiperItem', { static: false }) swiperContainer: any;
  startAnimation = false;

  private readonly EVENTS_SLIDE_INDEX = 1;

  constructor(
    private modalController: ModalController,
    private navController: NavController,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    this.translateCategories();
  }

  private translateCategories() {
    this.categoriesTranslates = this.categories.map((category) => ({
      ...category,
      title: this.translateService.instant(category.title),
    }));
  }

  ngAfterViewInit() {
    if (!this.disabled) return;
    this.animateToEventsSlide();
  }
  private animateToEventsSlide() {
    setTimeout(() => {
      this.startAnimation = true;
      this.animateToSlide(this.EVENTS_SLIDE_INDEX);
    }, 1500);
  }

  private animateToSlide(index: number) {
    this.selectedIndex = index;
    this.swiperContainer?.nativeElement?.swiper?.slideTo(index, 2000);
  }

  async onNavigateCategorie(category: Category) {
    if (this.disabled) return;

    if (!category?.navigation) {
      console.warn('No navigation config found for category:', category?.title);
      return;
    }

    await this.navigate(category.navigation);
  }

  private async navigate(config: NavigationConfig) {
    if (config.type === 'modal') {
      await this.openModal(config);
    } else if (config.type === 'url') {
      this.navigateToUrl(config.url!);
    }
  }

  private async openModal(config: NavigationConfig) {
    const modal = await this.modalController.create({
      component: config.component,
      componentProps: config.componentProps || {},
    });
    await modal.present();
  }

  private navigateToUrl(url: string) {
    this.navController.navigateForward(url);
  }

}
