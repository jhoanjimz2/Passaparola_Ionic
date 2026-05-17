import { CommonModule }                                                          from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input }                              from '@angular/core';
import { IonicModule, ModalController }                                          from '@ionic/angular';
import { Menu }                                                                  from 'src/app/shared/interfaces/multiple-profile-business/multiple-profile-business';
import { SeatCategoryMenuComponent }                                             from '../../edit-profile/seat-category-menu/seat-category-menu.component';
import { SeatProductMenuComponent }                                              from '../../edit-profile/seat-product-menu/seat-product-menu.component';
import { SocialService }                                                         from 'src/app/shared/services/social.service';
import { Observable, Subscription }                                              from 'rxjs';
import { FormattNumberPipe }                                                     from 'src/app/shared/pipes';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  imports: [
    IonicModule,
    CommonModule,
    FormattNumberPipe
],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  standalone: true
})
export class MenuComponent {
  @Input() menus: Menu[] = [];
  menuSelect: Menu = {} as Menu;

  subscriptions: Subscription[] = [];
  showDetail: boolean = true;

  constructor(
    private modalCtrl: ModalController,
    private socialService: SocialService
  ){
    this.autoSubscribe(this.socialService.showDetailObservable, v => this.showDetail = v);
  }
  private autoSubscribe<T>(obs$: Observable<T>, setter: (v: T) => void) {
    const sub = obs$.subscribe(setter);
    this.subscriptions.push(sub);
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  selectMenu(menu: Menu) {
    this.menuSelect = menu;
  }


  async onSeatCategoryMenu() {
    const modal = await this.modalCtrl.create({
      component: SeatCategoryMenuComponent,
      cssClass: 'modal-60vh',
      backdropDismiss: true,
    });
    await modal.present();

    // const { data } = await modal.onWillDismiss();

    // if (data?.next) this.update({ ...data.percentages });
  }
  async onSeatProductMenu() {
    const modal = await this.modalCtrl.create({
      component: SeatProductMenuComponent,
      cssClass: 'modal-85vh',
      backdropDismiss: true,
    });
    await modal.present();

    // const { data } = await modal.onWillDismiss();

    // if (data?.next) this.update({ ...data.percentages });
  }

}
