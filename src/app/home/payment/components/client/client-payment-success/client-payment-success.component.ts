import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-client-payment-success',
  templateUrl: './client-payment-success.component.html',
  styleUrls: ['./client-payment-success.component.scss'],
})
export class ClientPaymentSuccessComponent implements OnInit {
  @Input() amount: number = 0;
  @Input() cashBack: number = 0;
  @Input() companyAddress: string = '';
  @Input() companyName: string = '';
  @Input() idOperation: number = 0;
  @Input() points: number = 0;
  @Input() profilePictureUrlFile: string = '';

  date!: Date;

  constructor(private modalController: ModalController) {}

  ngOnInit() {
    this.date = new Date();
  }

  onGoToHome() {
    this.modalController.dismiss();
  }
}
