import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ModalController }               from '@ionic/angular';

import { TranslateService }              from '@ngx-translate/core';
import { Subscription }                  from 'rxjs';

import { IBankAccount }                  from 'src/app/shared/interfaces/bank-account/bank-account.interface';
import { Company }                       from 'src/app/shared/interfaces/company/company.interface';
import { Country }                       from 'src/app/shared/interfaces/country/country.interface';
import { SmsSendCodeRequest }            from 'src/app/shared/interfaces/sms-code/request/sms-send-code-request.interface';
import { User }                          from 'src/app/shared/interfaces/user/user.interface';
import { Wallet }                        from 'src/app/shared/interfaces/wallet/wallet.interface';
import { WithdrawTransfer }              from 'src/app/shared/interfaces/wallet/withdraw-transfer';
import {
  PlatformService,
  SmsCodeService,
  WalletService,
} from 'src/app/shared/services';
import { environment }                   from 'src/environments/environment';
import { SuccessfullyWithdrawComponent } from '../successfully-withdraw/successfully-withdraw.component';
import { ErrorWithdrawComponent }        from '../error-withdraw/error-withdraw.component';
import { NgxSpinnerService }             from 'ngx-spinner';

@Component({
  selector: 'app-confirm-withdraw',
  templateUrl: './confirm-withdraw.component.html',
  styleUrls: ['./confirm-withdraw.component.scss'],
})
export class ConfirmWithdrawComponent implements OnInit, OnDestroy {
  @Input() bankAccount: IBankAccount = {} as IBankAccount;
  @Input() amount = 0;
  @Input() wallet: Wallet | undefined;
  formCode: FormGroup = {} as FormGroup;
  smsSendCodeRequest: SmsSendCodeRequest = {} as SmsSendCodeRequest;
  smsCodeId: string = '';
  countries: Country[] = [];
  user: User | Company | undefined;

  smsCodeSuscription: Subscription | undefined;
  smsCodeRead = false;

  constructor(
    private formBuild: FormBuilder,
    private translate: TranslateService,
    private smsCodeService: SmsCodeService,
    private walletService: WalletService,
    private modalController: ModalController,
    private spinner: NgxSpinnerService,
    private platformService: PlatformService
  ) {}

  ngOnInit() {
    const user: any = localStorage.getItem('appPassaparola_user');
    this.user = JSON.parse(user);
    this.buildForm();
    this.getCode();

    this.smsCodeService.smsCodeSet(null);
    this.smsCodeSuscription = this.smsCodeService.smsCodeWatch().subscribe({
      next: (smsCode) => {
        if (smsCode) {
          this.smsCodeRead = true;
          this.setCode(smsCode);
        }
      },
    });
  }

  ngOnDestroy() {
    this.smsCodeService.smsCodeSet(null);
    this.smsCodeSuscription?.unsubscribe();
  }

  buildForm() {
    this.formCode = this.formBuild.group({
      code: new FormControl(null, [
        Validators.required,
        Validators.min(1),
        Validators.minLength(6),
      ]),
    });
  }

  getLastFourDigits(value: string) {
    const digitsOnly = value.replace(/\D/g, '');
    return digitsOnly.slice(-4);
  }

  withdraw() {
    const date = new Date();
    const randomNum = Math.random() * 10000;
    const num = Math.round(randomNum).toString().padStart(5, '0');
    const transactionId = num + date.getTime().toString();

    const withdraw: WithdrawTransfer = {
      iban: this.bankAccount.accountNumber,
      transactionId,
      status: true,
      isExecuted: false,
      amount: this.amount,
      userId: this.user?.userID!,
      walletFrom: this.wallet?.id!,
      countryCode: this.wallet?.countryCode!,
    };
    this.walletService.createWithdrawTransfer(withdraw).subscribe({
      next: async (response) => {
        this.getWalletById(response.walletFrom);
        this.modalController.dismiss();
        const modal = await this.modalController.create({
          component: SuccessfullyWithdrawComponent,
          backdropDismiss: true,
          componentProps: {
            bankAccount: this.bankAccount,
            amount: this.amount,
            idTransaction: response.transactionId,
          },
          cssClass: 'modal-full-screen',
        });
        await modal.present();
      },
      error: async () => {
        this.modalController.dismiss();
        const modal = await this.modalController.create({
          component: ErrorWithdrawComponent,
          backdropDismiss: true,
          componentProps: {
            bankAccount: this.bankAccount,
            amount: this.amount,
            idTransaction: transactionId,
            transferRequets: withdraw,
          },
          cssClass: 'modal-full-screen',
        });
        await modal.present();
      },
    });
  }

  getCode() {
    const user: any = localStorage.getItem('appPassaparola_user');
    const phonePrefix = JSON.parse(user).country.phonePrefix;
    const phone = JSON.parse(user).phoneNumber;
    this.smsSendCodeRequest = {
      from: environment.appName,
      to: `${phonePrefix}${phone}`,
      text: this.translate.instant('GENERAL.VERIFICATION_CODE'),
      languageCode: localStorage.getItem('language')
        ? localStorage.getItem('language')!
        : 'it',
    };
    this.smsCodeService.sendSms(this.smsSendCodeRequest).subscribe({
      next: (response) => {
        setTimeout(() => {
          this.spinner.show();
        }, 100);
        this.smsCodeId = response.entity.id;
        setTimeout(() => {
          this.spinner.hide();
        }, 2000);
      },
    });
  }

  checkCode() {
    const code = this.formCode.controls['code'].value;
    this.smsCodeService.checkCode(code, this.smsCodeId).subscribe({
      next: (response) => {
        if (response) {
          this.withdraw();
        }
      },
    });
  }

  getWalletById(walletId: string) {
    this.walletService.findWalletById(walletId).subscribe({
      next: (response) => {
        this.walletService.myWalletSet(response);
      },
    });
  }

  async setCode(code: string) {
    this.formCode.controls['code'].setValue(code);
    this.spinner.hide();
  }
}
