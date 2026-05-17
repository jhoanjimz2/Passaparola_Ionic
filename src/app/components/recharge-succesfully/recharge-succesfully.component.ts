import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { PaymentMethod } from 'src/app/shared/interfaces/stripe/payment-method.interface';

@Component({
  selector: 'app-recharge-succesfully',
  templateUrl: './recharge-succesfully.component.html',
  styleUrls: ['./recharge-succesfully.component.scss'],
})
export class RechargeSuccesfullyComponent implements OnInit {
  @Input() amount = 0;
  @Input() idTransaction = '';
  @Input() paymentMethod: PaymentMethod = {} as PaymentMethod;

  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  backToHome() {
    this.modalController.dismiss();
  }
}
