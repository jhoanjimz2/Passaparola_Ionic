import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  InfiniteScrollCustomEvent,
  ModalController,
  NavController,
} from '@ionic/angular';
import { Position, Geolocation }                    from '@capacitor/geolocation';

import { finalize, switchMap, tap }                 from 'rxjs';

import { ScanQrComponent }                          from 'src/app/components/scan-qr/scan-qr.component';
import { ClientPaymentResumeComponent }             from '../payment/components/client/client-payment-resume/client-payment-resume.component';
import { ClientPaymentSuccessComponent }            from '../payment/components/client/client-payment-success/client-payment-success.component';
import { ClientPaymentDeniedComponent }             from '../payment/components/client/client-payment-denied/client-payment-denied.component';
import {
  CompanyService,
  EventsService,
  UserService,
  UtilsService,
  WalletService,
  WebsocketService,
} from 'src/app/shared/services';
import { Wallet }                                   from 'src/app/shared/interfaces/wallet/wallet.interface';
import { Company }                                  from 'src/app/shared/interfaces/company/company.interface';
import { Reasons }                                  from 'src/app/shared/interfaces/wallet/enum/reasons.interfaces';
import { Operations }                               from 'src/app/shared/interfaces/wallet/enum/operations.interfaces';
import { TransferATMRequets }                       from 'src/app/shared/interfaces/wallet/requets/transfer-atm-requets.interface';
import { User }                                     from 'src/app/shared/interfaces/user/user.interface';
import { ConfirmationPinComponent }                 from 'src/app/components/confirmation-pin/confirmation-pin.component';
import { KeyboardAtmComponent }                     from 'src/app/components/keyboard-atm/keyboard-atm.component';
import { TransferComponent }                        from '../wallet/components/transfer/transfer.component';
import { Contact }                                  from 'src/app/shared/interfaces/contact/contact.interface';
import { SeatService }                              from 'src/app/shared/services/seat.service';
import { GeolocationService }                       from 'src/app/shared/services/geolocation.service';
import { SwiperContainer }                          from 'swiper/element';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {
  amount: number = 0;
  cashBack: number = 0;
  companyAddress: string = '';
  companyName: string = '';
  companyTo: Company = {} as Company;
  idOperation: string = '';
  isBusiness = false;
  points: number = 0;
  transferRequest: TransferATMRequets = {} as TransferATMRequets;
  userId: string = '';
  user: User | Company | undefined;
  userTo: User = {} as User;
  walletFrom: Wallet = {} as Wallet;
  walletTo: Wallet = {} as Wallet;
  wallets: Wallet[] = [];
  refresh: any;
  updateData = false;
  position: Position = {} as Position;
  isBussines = false;
  hasMoreItems = true;
  items: any[] = [];
  offset: number = 0;
  limit: number = 10;

  slideCards: any[] = [
    {
      title_1: 'MAIN_PAGE.SLIDE_1.TEXT_1',
      title_2: 'MAIN_PAGE.SLIDE_1.TEXT_2',
      text_1: 'MAIN_PAGE.SLIDE_1.TEXT_3',
      text_2: 'MAIN_PAGE.SLIDE_1.TEXT_4',
    },
    {
      title_1: 'MAIN_PAGE.SLIDE_2.TEXT_1',
      title_2: 'MAIN_PAGE.SLIDE_2.TEXT_2',
      text_1: 'MAIN_PAGE.SLIDE_2.TEXT_3',
      text_2: 'MAIN_PAGE.SLIDE_2.TEXT_4',
    },
  ];
  indexSlideActive = 0;

  @ViewChild('swiperMain', { static: false }) swiperContainer: any;

  constructor(
    private companyService: CompanyService,
    private modalController: ModalController,
    private walletService: WalletService,
    private websocketService: WebsocketService,
    private userService: UserService,
    private seatService: SeatService,
    private geolocationService: GeolocationService,
    private utilsService: UtilsService,
    private eventsService: EventsService
  ) {}

  ngOnInit() {
    this.loadItems();
    this.user = JSON.parse(localStorage.getItem('appPassaparola_user')!);
    this.getDefaultWallet(this.user?.userID!);
    this.eventsService.dataGeneralEvents();
  }

  async ionViewDidEnter() {
    this.position = {} as Position;
    this.position = await Geolocation.getCurrentPosition({
      maximumAge: 3000,
      timeout: 10000,
      enableHighAccuracy: true,
    });

    const swiperEl = this.swiperContainer.nativeElement as any;
    swiperEl.initialize();
    swiperEl.swiper.autoplay.start();
  }

  getDefaultWallet(userId: string) {
    this.walletService.findDefaultWallet(userId).subscribe({
      next: (response) => {
        this.walletFrom = response;
      },
    });
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      this.updateData = true;
      this.refresh = event;
      event.target.complete();
    }, 1000);
  }

  async modalQrScan() {
    const modal = await this.modalController.create({
      component: ScanQrComponent,
      backdropDismiss: true,
      componentProps: {},
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();

    if (!data) return;

    let amount = 0;
    let wallet = '';
    const qrValue: string = data.qrValue;
    if (qrValue.includes('amount') && qrValue.includes('wallet')) {
      const dataQrValue = JSON.parse(qrValue);
      wallet = dataQrValue.wallet;
      amount = dataQrValue.amount;
      this.amount = dataQrValue.amount;
    }
    this.getWalletByUserIdAndProg(wallet ? wallet : qrValue, amount);
  }

  getWalletByUserIdAndProg(code: string, amount: number) {
    this.walletService
      .findWalletByUserIdAndProg(code)
      .pipe(
        switchMap((wallet) => {
          this.walletTo = wallet;
          const checkUserIdTo = wallet.userId.charAt(wallet.userId.length - 1);
          if (checkUserIdTo === 'B' || checkUserIdTo === 'P') {
            this.isBussines = true;
            return this.companyService.getCompanyByUserId(wallet.userId);
          }
          return this.userService.getUserByUserID(wallet.userId);
        })
      )
      .subscribe((response: any) => {
        if (this.isBussines) this.companyTo = response as Company;
        if (!this.isBussines) this.userTo = response as User;

        if (amount) {
          // // this.modalTransfer(amount);
          // //       this.companyTo = response as Company;

          // this.cashBack =
          //   (this.amount * response.profile?.cashBackPercentage!) / 100;
          // this.points =
          //   (this.amount * response.profile?.pointsPercentage!) / 100;
          // return;
          this.companyTo = response as any;

          this.cashBack = this.isBussines
            ? (this.amount * response.profile?.cashBackPercentage!) / 100
            : 0;
          this.points = this.isBussines
            ? (this.amount * response.profile?.pointsPercentage!) / 100
            : 0;

          this.onOpenModalClientPaymentResume();

          return;
        }
        this.modalKeyboard();
      });
  }

  async onOpenModalClientPaymentResume() {
    const modal = await this.modalController.create({
      component: ClientPaymentResumeComponent,
      cssClass: 'modal-full-screen',
      backdropDismiss: true,
      componentProps: {
        amount: this.amount,
        cashBack: this.cashBack,
        companyAddress: this.companyTo.profile?.legalAddress,
        companyName: this.companyTo.profile?.name,
        points: this.points,
        profilePictureUrlFile: this.companyTo.profile?.profilePictureUrlFile,
      },
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();

    if (data?.confirmTransfer) {
      if (this.amount >= 50) {
        let isBussines = false;
        const checkUserIdTo = this.walletFrom.userId.charAt(
          this.walletFrom.userId.length - 1
        );

        if (checkUserIdTo === 'B' || checkUserIdTo === 'P') isBussines = true;
        const modal = await this.modalController.create({
          component: ConfirmationPinComponent,
          backdropDismiss: true,
          componentProps: { isCompany: isBussines },
          cssClass: 'modal-95vh',
        });
        await modal.present();
        const { data } = await modal.onDidDismiss();

        if (data.pin) this.confirmTransfer();
      } else this.confirmTransfer();
    }
  }

  async confirmTransfer() {
    this.transferRequest = {
      walletFrom: this.walletFrom.id!,
      walletTo: this.walletTo.id!,
      amount: this.amount,
      isCash: false,
      typeOperation: Operations.transfer,
      status: 1,
      reason: Reasons.payment,
      observation: '',
      reasonStatusTransfer: Reasons.payment,
      rewardPercentage: this.companyTo.profile?.rewardPercentage,
      cashBackPercentage: this.companyTo.profile?.cashBackPercentage,
      helpPercentage: this.companyTo.profile?.helpPercentage,
      drawingPercentage: this.companyTo.profile?.drawingPercentage,
      communityPercentage: this.companyTo.profile?.communityPercentage,
      pointsPercentage: this.companyTo.profile?.pointsPercentage,
    };

    this.walletService
      .transferATM({ ...this.transferRequest, transactionType: 'send' })
      .subscribe({
        next: (response) => {
          const arrayId = response.id.split('-');
          this.idOperation = arrayId[arrayId.length - 1];

          this.onOpenModalClientPaymentSuccess();
        },
        error: () => {
          this.onOpenModalClientPaymentDenied();
        },
      });
  }

  async onOpenModalClientPaymentSuccess() {
    const modal = await this.modalController.create({
      component: ClientPaymentSuccessComponent,
      cssClass: 'modal-full-screen',
      backdropDismiss: true,
      componentProps: {
        amount: this.amount,
        cashBack: this.cashBack,
        companyAddress: this.companyTo.profile?.legalAddress,
        companyName: this.companyTo.profile?.name,
        points: this.points,
        profilePictureUrlFile: this.companyTo.profile?.profilePictureUrlFile,
      },
    });
    await modal.present();
  }

  async onOpenModalClientPaymentDenied() {
    const modal = await this.modalController.create({
      component: ClientPaymentDeniedComponent,
      cssClass: 'modal-full-screen',
      backdropDismiss: true,
      componentProps: {
        amount: this.amount,
        cashBack: this.cashBack,
        companyName: this.companyTo.profile?.name,
        idOperation: this.idOperation,
        points: this.points,
        profilePictureUrlFile: this.companyTo.profile?.profilePictureUrlFile,
      },
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();

    if (data?.confirmTransfer) this.confirmTransfer();

    if (data?.cancel) this.cancelTransfer();
  }

  cancelTransfer() {
    this.websocketService.emitMessage({
      userId: this.userId,
      type: 'cancelPayment',
      payload: {
        amount: this.amount,
        wallet: `${this.walletTo.userId}-${this.walletTo.prog}`,
      },
    });
  }

  async modalKeyboard() {
    const modal = await this.modalController.create({
      component: KeyboardAtmComponent,
      backdropDismiss: true,
      componentProps: { balance: this.walletFrom.balance },
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (!data) return;
    const amount = parseFloat(data.amount);
    this.modalTransfer(amount);
  }

  async modalTransfer(amount: number) {
    const contact: Contact = {
      name: !this.isBussines
        ? `${this.userTo.profile?.name} ${this.userTo.profile?.lastName}`
        : `${this.companyTo.profile?.name}`,
      user: this.userTo,
      company: this.companyTo,
      isBussines: this.isBussines,
    };

    const modal = await this.modalController.create({
      component: TransferComponent,
      backdropDismiss: true,
      componentProps: {
        amount,
        contact,
        walletFrom: this.walletFrom,
        walletTo: this.walletTo,
        transactionType: 'send',
      },
      cssClass: 'modal-full-screen',
    });

    await modal.present();
  }

  private generateItems(ev: any) {
    if (!this.hasMoreItems) {
      (ev as InfiniteScrollCustomEvent)?.target?.complete();
      return;
    }
    this.loadItems(ev);
  }

  private loadItems(ev?: any) {
    this.seatService
      .findAll({
        limit: this.limit,
        offset: this.offset,
        isSuggested: true,
        categoryIds: [],
        keyword: '',
      })
      .pipe(
        tap(async (response) => {
          if (ev) {
            if (response.length < this.limit) {
              this.hasMoreItems = false;
            }
            this.items = [...this.items, ...response];
            this.offset += this.limit;
          } else {
            this.items = response;
            this.position = await this.geolocationService.getLocation();
            this.items = this.items.map((item) => {
              let distance = 0;
              if (item.latitude && item.longitude && this.position) {
                distance = parseFloat(
                  this.geolocationService
                    .getDistance(
                      parseFloat(item.latitude),
                      parseFloat(item.longitude),
                      this.position.coords.latitude,
                      this.position.coords.longitude,
                      'km'
                    )
                    .toFixed(2)
                );
              }
              return {
                ...item,
                distance,
              };
            });
            this.items = this.utilsService.sortByField(
              this.items,
              'distance',
              true
            );
            this.offset = this.limit;
            this.hasMoreItems = response.length === this.limit;
          }
        }),
        finalize(() => {
          (ev as InfiniteScrollCustomEvent)?.target?.complete();
        })
      )
      .subscribe();
  }

  onIonInfinite(ev: any) {
    this.generateItems(ev);
  }

  onSearch(ev: any) {}
}
