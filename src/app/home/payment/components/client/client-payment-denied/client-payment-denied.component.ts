import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-client-payment-denied',
  templateUrl: './client-payment-denied.component.html',
  styleUrls: ['./client-payment-denied.component.scss'],
})
export class ClientPaymentDeniedComponent implements OnInit {
  @Input() amount: number = 0;
  @Input() cashBack: number = 0;
  @Input() companyName: string = '';
  @Input() points: number = 0;
  @Input() profilePictureUrlFile: string = '';

  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  confirmTransfer() {
    this.modalController.dismiss({
      confirmTransfer: true,
    });
  }

  cancel() {
    this.modalController.dismiss({
      cancel: true,
    });
  }
}
