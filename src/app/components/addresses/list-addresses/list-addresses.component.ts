import { Component, OnInit }      from '@angular/core';
import { ModalController }        from '@ionic/angular';
import { CreateAddressComponent } from '../create-address/create-address.component';

@Component({
  selector: 'app-list-addresses',
  templateUrl: './list-addresses.component.html',
  styleUrls: ['./list-addresses.component.scss'],
})
export class ListAddressesComponent  implements OnInit {

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

}
