import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Company } from 'src/app/shared/interfaces/company/company.interface';

import { NfcDivice } from 'src/app/shared/interfaces/passaparolaCard/nfc-divice.interface';
import { User } from 'src/app/shared/interfaces/user/user.interface';
import { NfcDiviceService } from 'src/app/shared/services/nfc-divice.service';
import { CreateSuccesfullyComponent } from '../create-succesfully/create-succesfully.component';

@Component({
  selector: 'app-security-amount',
  templateUrl: './security-amount.component.html',
  styleUrls: ['./security-amount.component.scss'],
})
export class SecurityAmountComponent implements OnInit {
  @Input() nfcSerial = '';
  @Input() nfcType = '';
  formWithdraw: FormGroup = {} as FormGroup;
  amounts: number[] = [100.0, 150.0, 250.0, 500.0];
  user: User | Company | undefined;

  constructor(
    private formBuild: FormBuilder,
    private nfcDiviceService: NfcDiviceService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    const user = localStorage.getItem('appPassaparola_user');
    if (user) {
      this.user = JSON.parse(user) as User | Company;
    }

    this.buildForm();
  }

  buildForm() {
    this.formWithdraw = this.formBuild.group({
      amount: new FormControl(0, [Validators.required, Validators.min(0.1)]),
    });
  }

  focus() {
    if (this.formWithdraw.controls['amount'].value === 0)
      this.formWithdraw.controls['amount'].setValue('');
  }

  losesFocus() {
    if (this.formWithdraw.controls['amount'].value === '')
      this.formWithdraw.controls['amount'].setValue(0);
  }

  setAmount(amount: number) {
    this.formWithdraw.controls['amount'].setValue(amount);
  }

  continue() {
    const nfcRequets: NfcDivice = {
      countryCode: this.user?.countryCode!,
      nfcSerial: this.nfcSerial,
      nfcType: { id: this.nfcType },
      community: this.user?.userID!,
      userId: this.user?.userID!,
      securityAmount: parseFloat(this.formWithdraw.controls['amount'].value),
      quantity: 1,
    };

    this.nfcDiviceService.createNfc(nfcRequets).subscribe({
      next: (res) => {
        console.info('NFC created successfully', res);
        this.modalSuccessfully();
      },
    });
  }

  async modalSuccessfully() {
    const modal = await this.modalController.create({
      component: CreateSuccesfullyComponent,
      backdropDismiss: true,
      componentProps: {},
      cssClass: 'modal-accept-atm-success',
    });
    await modal.present();
  }
}
