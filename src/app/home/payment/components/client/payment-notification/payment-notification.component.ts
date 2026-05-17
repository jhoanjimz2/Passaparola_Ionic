import { Component, Input, OnInit } from '@angular/core';

import { ModalController } from '@ionic/angular';
import { CompanyService } from 'src/app/shared/services';

@Component({
  selector: 'app-client-payment-notification',
  templateUrl: './payment-notification.component.html',
  styleUrls: ['./payment-notification.component.scss'],
})
export class PaymentNotificationComponent implements OnInit {
  @Input() walletTransaction: any;
  @Input() userId: string = '';

  name: string = '';
  address: string = '';

  constructor(
    private modalController: ModalController,
    private companyService: CompanyService
  ) {}

  ngOnInit() {
    this.getCompanyByUserId();
  }

  onCloseModal() {
    this.modalController.dismiss();
  }

  getCompanyByUserId() {
    this.companyService.getCompanyByUserId(this.userId).subscribe((company) => {
      this.name = company.profile?.name!;
      this.address = company.profile?.legalAddress!;
    });
  }
}
