import { CommonModule }                    from '@angular/common';
import { Component, Input }                from '@angular/core';
import { ModalController, NavController }  from '@ionic/angular';
import { IonIcon }                         from '@ionic/angular/standalone';
import { Address }                         from 'src/app/shared/interfaces/address/address.interface';

@Component({
  selector: 'app-address-card',
  templateUrl: './address-card.component.html',
  styleUrls: ['./address-card.component.scss'],
  standalone: true,
  imports: [
    IonIcon,
    CommonModule,
  ]
})
export class AddressCardComponent {
  @Input() address: Address = {} as Address;
  @Input() name: boolean = true;
  @Input() edit: boolean = true;
  @Input() delete: boolean = true;
  @Input() default: boolean = false;

  constructor(
    private modalCtrl: ModalController,
    private navCtrl: NavController
  ) {}


  async openModalDeleteAddress() {
    const { ModalDeleteAddressComponent } = await import('../modal-delete-address/modal-delete-address.component');
    const modal = await this.modalCtrl.create({
      component: ModalDeleteAddressComponent,
      cssClass: ['radius-modals', 'modal-75vh'],
      componentProps: { address: this.address },
      breakpoints: [0,1],
      initialBreakpoint: 1
    });
    await modal.present();
  }

  editAddress() {
    this.navCtrl.navigateForward(['/pages/address/create-address', this.address.id]);
  }
}
