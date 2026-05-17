import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ProfesionalsPageComponent } from '../../pages/profesionals/profesionals.component';
import { PhysicalBusinessComponent } from '../../pages/physical-business/physical-business.component';
import { TranslateService } from '@ngx-translate/core';
import { EventsComponent } from '../../pages/events/events.component';

@Component({
  selector: 'app-slider-categories',
  templateUrl: './slider-categories.component.html',
  styleUrls: ['./slider-categories.component.scss'],
})
export class SliderCategoriesComponent implements OnInit {
  @Input({ required: true }) set categories(value: any[]) {
    this.categoriesTranslates = value.map((category) => {
      return {
        ...category,
        title: this.translateService.instant(category.title),
      };
    });
  }

  categoriesTranslates: any[] = [];

  constructor(
    private modalController: ModalController,
    private translateService: TranslateService
  ) {}

  ngOnInit() {}

  async onNavigateCategorie(index: number) {
    let modal: HTMLIonModalElement | null = null;

    switch (index) {
      case 0:
        modal = await this.modalController.create({
          component: PhysicalBusinessComponent,
        });
        break;
      case 1:
        modal = await this.modalController.create({
          component: ProfesionalsPageComponent,
          componentProps: {},
        });
        break;
      case 2:
        modal = await this.modalController.create({
          component: ProfesionalsPageComponent,
          componentProps: {},
        });
        break;
      case 3:
        modal = await this.modalController.create({
          component: EventsComponent,
          componentProps: {},
        });
        break;
      default:
        break;
    }

    modal!.present();
  }
}
