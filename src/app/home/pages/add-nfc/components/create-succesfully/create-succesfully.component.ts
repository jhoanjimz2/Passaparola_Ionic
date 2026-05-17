import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-create-succesfully',
  templateUrl: './create-succesfully.component.html',
  styleUrls: ['./create-succesfully.component.scss'],
})
export class CreateSuccesfullyComponent implements OnInit {
  constructor(
    private modalController: ModalController,
    private navController: NavController,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {}

  async closeModal() {
    this.spinner.show();
    this.navController.navigateBack(['wallet']);
    let modal = await this.modalController.getTop();
    while (modal) {
      await this.modalController.dismiss();
      modal = await this.modalController.getTop();
    }
    this.spinner.hide();
  }
}
