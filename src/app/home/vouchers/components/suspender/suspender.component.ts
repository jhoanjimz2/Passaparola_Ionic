import { Component, OnInit } from '@angular/core';
import { ModalController }   from '@ionic/angular';
import { VouchersService }   from 'src/app/shared/services';

@Component({
  selector: 'app-suspender',
  templateUrl: './suspender.component.html',
  styleUrls: ['./suspender.component.scss'],
})
export class SuspenderComponent {

  constructor(
    private modalController: ModalController,
    private vouchersServices: VouchersService
  ) { }

  close() {
    this.modalController.dismiss()
  }

  aceptar() {
    this.modalController.dismiss({ data: false });
  }
}
