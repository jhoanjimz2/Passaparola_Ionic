import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-client-payment-resume',
  templateUrl: './client-payment-resume.component.html',
  styleUrls: ['./client-payment-resume.component.scss'],
})
export class ClientPaymentResumeComponent implements OnInit {
  @Input() amount: number = 0;
  @Input() cashBack: number = 0;
  @Input() companyAddress: string = '';
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
}
