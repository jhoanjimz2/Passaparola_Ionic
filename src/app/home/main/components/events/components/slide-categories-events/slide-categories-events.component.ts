import { Component, Input }         from '@angular/core';
import { CategoryEvent }            from 'src/app/shared/interfaces/events/events';
import { ModalController }          from '@ionic/angular';
import { AllEventsComponent }       from '../../modals/all-events/all-events.component';

@Component({
  selector: 'app-slide-categories-events',
  templateUrl: './slide-categories-events.component.html',
  styleUrls: ['./slide-categories-events.component.scss'],
})
export class SlideCategoriesEventsComponent {

  @Input() allCategories: CategoryEvent[] = [];

  constructor(
    private modalController: ModalController
  ) {}

  async openAllEventsFilter(categorySelect: CategoryEvent) {
    const modal = await this.modalController.create({
      component: AllEventsComponent,
      componentProps: { categorySelect }
    });
    modal.present();
  }

}
