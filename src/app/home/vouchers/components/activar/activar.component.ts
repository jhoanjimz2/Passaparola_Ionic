import { Component, OnInit } from '@angular/core';
import { ModalController }   from '@ionic/angular';

@Component({
  selector: 'app-activar',
  templateUrl: './activar.component.html',
  styleUrls: ['./activar.component.scss'],
})
export class ActivarComponent  implements OnInit {

  constructor(
    private modalController: ModalController
  ) { }

  ngOnInit() {}

  close() {
    this.modalController.dismiss()
  }

  aceptar() {
    this.modalController.dismiss({ data: true });
  }

}
