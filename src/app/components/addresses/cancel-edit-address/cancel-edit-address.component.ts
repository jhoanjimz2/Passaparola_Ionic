import { Component, OnInit } from '@angular/core';
import { ModalController }   from '@ionic/angular';

@Component({
  selector: 'app-cancel-edit-address',
  templateUrl: './cancel-edit-address.component.html',
  styleUrls: ['./cancel-edit-address.component.scss'],
})
export class CancelEditAddressComponent  implements OnInit {

  step: number = 1;

  constructor(
    private modalController: ModalController
  ) { }

  ngOnInit() {}

  closeModal(close: boolean = false) {
    this.modalController.dismiss({ close })
  }

}
