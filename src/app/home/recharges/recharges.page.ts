import { Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Observable, debounceTime, fromEvent, merge, switchMap } from 'rxjs';
import { ScanQrComponent } from 'src/app/components/scan-qr/scan-qr.component';
import { Company } from 'src/app/shared/interfaces/company/company.interface';
import { Contact } from 'src/app/shared/interfaces/contact/contact.interface';
import { User } from 'src/app/shared/interfaces/user/user.interface';
import { Wallet } from 'src/app/shared/interfaces/wallet/wallet.interface';
import {
  CompanyService,
  UserService,
  WalletService,
} from 'src/app/shared/services';
import { TpvComponent } from './components/tpv/tpv.component';
import { PaymentResumeComponent } from './components/payment-resume/payment-resume.component';
import { PaymentConfirmComponent } from './components/payment-confirm/payment-confirm.component';
import { PaymentSuccessComponent } from './components/payment-success/payment-success.component';
import { CompensationComponent } from './components/compensation/compensation.component';
import { IncreaseLimitComponent } from './components/increase-limit/increase-limit.component';
import {
  FormBuilder,
  FormControl,
  FormControlName,
  FormGroup,
  Validators,
} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { GenericValidator } from 'src/app/shared/validators/generic-validator';
import { Operations } from 'src/app/shared/interfaces/wallet/enum/operations.interfaces';
import { Reasons } from 'src/app/shared/interfaces/wallet/enum/reasons.interfaces';
import { TransferATMRequets } from 'src/app/shared/interfaces/wallet/requets/transfer-atm-requets.interface';

@Component({
  selector: 'app-recharges',
  templateUrl: './recharges.page.html',
  styleUrls: ['./recharges.page.scss'],
})
export class RechargesPage implements OnInit {
  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements!: ElementRef[];

  amount = '0';
  buttonActive = 'leftButton';
  companyTo: Company = {} as Company;
  contact: Contact = {} as Contact;
  created: boolean = false;
  data: any;
  decimalAmount = '00';
  displayMessage: any = {};
  form: FormGroup = {} as FormGroup;
  idOperation: string = '';
  infiniteScrollEnabled = false;
  isBusiness = false;
  limit = 5;
  mainAmount = '0';
  page = 1;
  recharges: any[] = [];
  transferRequest: TransferATMRequets = {} as TransferATMRequets;
  user: User = {} as User;
  userTo: User = {} as User;
  validationMessages: any;
  walletFrom: Wallet = {
    balance: 1500,
  } as Wallet;
  walletTo: Wallet = {} as Wallet;
  isInit = false;

  private genericValidator!: GenericValidator;

  constructor(
    private formBuild: FormBuilder,
    private translate: TranslateService,
    private modalController: ModalController,
    private userService: UserService,
    private companyService: CompanyService,
    private walletService: WalletService
  ) {
    this.genericValidator = new GenericValidator();
  }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('appPassaparola_user')!);
    this.initForm();
    this.findWalletsRechargeByUserId();
  }

  ionViewDidEnter() {
    if (this.isInit) this.rechargesByWalletId();
  }

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements.map(
      (formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur')
    );

    merge(this.form.valueChanges, ...controlBlurs)
      .pipe(debounceTime(100))
      .subscribe(() => {
        this.checksValidations();
      });
  }

  checksValidations() {
    this.displayMessage = this.genericValidator.processMessages(
      this.form,
      this.validationMessages
    );
  }

  initForm() {
    this.validationMessages = {
      term1: {
        required: this.translate.instant('ERROR_MESSAGE.REQUIRED'),
      },
      term2: {
        required: this.translate.instant('ERROR_MESSAGE.REQUIRED'),
      },
    };

    this.form = this.formBuild.group({
      term1: new FormControl(false, [Validators.requiredTrue]),
      term2: new FormControl(false, [Validators.requiredTrue]),
    });
  }

  findWalletsRechargeByUserId() {
    this.walletService
      .findWalletsRechargeByUserId(this.user.userID!)
      .subscribe({
        next: (response: any) => {
          if (response.name) {
            this.walletFrom = response;
            this.created = true;
            this.rechargesByWalletId();
          } else this.created = false;
        },
      });
  }

  createWalletRecharges() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      this.checksValidations();
      return;
    }

    const wallet: Wallet = {
      name: 'Recharge',
      userId: this.user.userID!,
      countryCode: this.user.countryCode,
      isRechargeWallet: true,
    };

    this.walletService.createWalletRecharges(wallet).subscribe({
      next: (response: any) => {
        this.walletFrom = response;
        this.created = true;
        this.rechargesByWalletId();
      },
    });
  }

  rechargesByWalletId(event?: any) {
    this.isInit = true;
    this.walletService
      .rechargesByWalletId({
        walletId: this.walletFrom.id,
        offset: this.page,
        limit: this.limit,
      })
      .subscribe(({ data, metadata }: any) => {
        if (event?.target) {
          event?.target?.complete();
        }
        if (!data) return;
        this.recharges.push(...data);
        this.page++;

        if (metadata.page < metadata.lastPage)
          this.infiniteScrollEnabled = true;
        else this.infiniteScrollEnabled = false;

        if (event?.target) {
          event?.target?.complete();
        }
      });
  }

  onActiveButton(buttonActive: string) {
    this.buttonActive = buttonActive;
  }

  onChangeAmount({
    amount,
    mainAmount,
    decimalAmount,
  }: {
    amount: string;
    mainAmount: string;
    decimalAmount: string;
  }) {
    this.amount = amount;
    this.mainAmount = mainAmount;
    this.decimalAmount = decimalAmount;
  }

  async onOpenModalTpv() {
    const modal = await this.modalController.create({
      component: TpvComponent,
      cssClass: 'modal-full-screen',
      backdropDismiss: true,
      componentProps: {},
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();

    if (parseFloat(data.mainAmount) <= 0) return;

    this.amount = data.amount;
    this.mainAmount = data.mainAmount;
    this.decimalAmount = data.decimalAmount;

    this.goScanQr();
  }

  async goScanQr() {
    const modal = await this.modalController.create({
      component: ScanQrComponent,
      backdropDismiss: true,
      componentProps: {},
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();

    if (!data) return;

    const qrValue: string = data.qrValue;

    if (qrValue) {
      this.getWalletByUserIdAndProg(qrValue);
    }
  }

  getWalletByUserIdAndProg(code: string) {
    this.walletService
      .findWalletByUserIdAndProg(code)
      .pipe(
        switchMap((wallet) => {
          this.walletTo = wallet;
          const checkUserIdTo = wallet.userId.charAt(wallet.userId.length - 1);
          if (checkUserIdTo === 'B' || checkUserIdTo === 'P') {
            this.isBusiness = true;
            return this.companyService.getCompanyByUserId(wallet.userId);
          }
          return this.userService.getUserByUserID(wallet.userId);
        })
      )
      .subscribe((response) => {
        if (this.isBusiness) this.companyTo = response as Company;
        if (!this.isBusiness) this.userTo = response as User;

        this.contact = {
          name: !this.isBusiness
            ? `${this.userTo.profile?.name} ${this.userTo.profile?.lastName}`
            : `${this.companyTo.profile?.name}`,
          user: this.userTo,
          company: this.companyTo,
          isBussines: this.isBusiness,
        };

        this.goPaymentResume();
      });
  }

  async goPaymentResume() {
    const modal = await this.modalController.create({
      component: PaymentResumeComponent,
      backdropDismiss: true,
      componentProps: {
        mainAmount: this.mainAmount,
        decimalAmount: this.decimalAmount,
        wallet: `${this.walletTo.userId}-${this.walletTo.prog}`,
      },
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();

    if (!data) return;

    if (data?.nextStep) this.goPaymentConfirm();
  }

  async goPaymentConfirm() {
    const modal = await this.modalController.create({
      component: PaymentConfirmComponent,
      backdropDismiss: true,
      componentProps: {},
      cssClass: 'modal-75vh',
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();

    if (!data) return;

    if (data?.nextStep) this.confirmTransfer();
  }

  async confirmTransfer() {
    this.transferRequest = {
      amount: parseFloat(this.amount),
      observation: '',
      reason: Reasons.send,
      reasonStatusTransfer: Reasons.send,
      status: 1,
      typeOperation: Operations.recharge,
      walletTo: this.walletTo.id!,
      walletFrom: this.walletFrom.id!,
      transactionType: 'send',
    };

    this.walletService.transferATM(this.transferRequest).subscribe({
      next: (response) => {
        const arrayId = response.id.split('-');
        this.idOperation = arrayId[arrayId.length - 1];
        this.goPaymentSuccess();
      },
      error: () => {},
    });
  }

  async goPaymentSuccess() {
    const modal = await this.modalController.create({
      component: PaymentSuccessComponent,
      backdropDismiss: true,
      componentProps: {
        decimalAmount: this.decimalAmount,
        idOperation: this.idOperation,
        mainAmount: this.mainAmount,
        wallet: `${this.walletFrom.userId}-${this.walletFrom.prog}`,
      },
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();

    this.onGoToHome();
  }

  onGoToHome() {
    this.amount = '0';
    this.mainAmount = '0';
    this.decimalAmount = '00';
    this.infiniteScrollEnabled = false;
    this.page = 1;
    this.recharges = [];
    this.findWalletsRechargeByUserId();
  }

  async goCompensation() {
    const modal = await this.modalController.create({
      component: CompensationComponent,
      backdropDismiss: true,
      componentProps: {},
      cssClass: 'modal-75vh',
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();

    if (!data) return;
  }

  async goIncreaseLimit() {
    const modal = await this.modalController.create({
      component: IncreaseLimitComponent,
      backdropDismiss: true,
      componentProps: {},
      cssClass: 'modal-75vh',
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();

    if (!data) return;
  }
}
