import { Component, Input, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-assing-successful',
  templateUrl: './assing-successful.component.html',
  styleUrls: ['./assing-successful.component.scss'],
})
export class AssingSuccessfulComponent implements OnInit {
  @Input() cardNumber = '';
  @Input() prefix = '';
  @Input() phoneNumber = '';

  constructor(
    private modalController: ModalController,
    private navController: NavController
  ) {}

  ngOnInit() {}

  formattcardNumber(number: string) {
    return number.replace(/(.{4})/g, '$1 ');
  }

  closeModal() {
    this.modalController.dismiss();
    this.navController.back();
  }
}
