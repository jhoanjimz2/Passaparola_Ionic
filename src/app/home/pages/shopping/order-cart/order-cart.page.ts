import { Component, OnInit }      from '@angular/core';
import { ModalController }        from '@ionic/angular';
import { CreateAddressComponent } from 'src/app/components/addresses/create-address/create-address.component';

@Component({
  selector: 'app-order-cart',
  templateUrl: './order-cart.page.html',
  styleUrls: ['./order-cart.page.scss'],
})
export class OrderCartPage implements OnInit {

  constructor(
    private modalController: ModalController
  ) { }

  ngOnInit() {}

  async modalCreateEditAddress(edit: boolean) {
    const modal = await this.modalController.create({
      component: CreateAddressComponent,
      componentProps: { edit }
    });
    await modal.present();
  }

  payOrder() {}

}
