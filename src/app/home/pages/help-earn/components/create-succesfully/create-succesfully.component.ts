import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-create-succesfully',
  templateUrl: './create-succesfully.component.html',
  styleUrls: ['./create-succesfully.component.scss'],
})
export class CreateSuccesfullyComponent implements OnInit {
  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  close() {
    this.modalController.dismiss();
  }
}
