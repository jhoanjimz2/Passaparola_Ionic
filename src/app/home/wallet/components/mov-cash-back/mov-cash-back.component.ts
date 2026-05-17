import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { WalletTransaction } from 'src/app/shared/interfaces/wallet/wallet-transaction.interface';
import { Wallet } from 'src/app/shared/interfaces/wallet/wallet.interface';
import {
  CompanyService,
  UserService,
  WalletService,
} from 'src/app/shared/services';
import { AcceptAtmSuccessfullyComponent } from '../accept-atm-successfully/accept-atm-successfully.component';
import { switchMap } from 'rxjs';

enum FILTERS {
  all = 'all',
  received = 'received',
  paid = 'paid',
  standby = 'standby',
}

@Component({
  selector: 'app-mov-cash-back',
  templateUrl: './mov-cash-back.component.html',
  styleUrls: ['./mov-cash-back.component.scss'],
})
export class MovCashBackComponent implements OnInit {
  @Input() wallet: Wallet = {} as Wallet;
  movements: WalletTransaction[] = [];
  movementsFiltered: WalletTransaction[] = [];
  buttons = [
    { index: 0, title: 'WALLET.MOVEMENT.ALL', filter: FILTERS.all },
    { index: 1, title: 'WALLET.MOVEMENT.RECEIVED', filter: FILTERS.received },
    { index: 2, title: 'WALLET.MOVEMENT.PAID', filter: FILTERS.paid },
    { index: 3, title: 'WALLET.MOVEMENT.IN_WAITING', filter: FILTERS.standby },
  ];
  buttonIndex = 0;

  @ViewChild('header', { read: ElementRef, static: false })
  header!: ElementRef;
  headerHeight = 0;
  heightContainer = 0;

  page = 1;
  pages = 0;
  limit = 1000;
  offset = 0;
  totalRecords = 0;
  pagesArray: number[] = [];
  filter: 'all' | 'received' | 'paid' | 'standby' = 'all';
  filters = FILTERS;
  tranferATMaccepted: WalletTransaction = {} as WalletTransaction;
  cashBack = 0;

  constructor(
    private walletService: WalletService,
    private platform: Platform,
    private modalController: ModalController,
    private userService: UserService,
    private companyService: CompanyService
  ) {}

  ngOnInit() {
    this.getMovements();
    this.heighPage();
    this.platform.resize.subscribe(async () => {});
  }

  heighPage() {
    this.platform.ready().then(() => {
      this.heightContainer =
        this.platform.height() - 80 - this.header.nativeElement.offsetHeight;
    });
  }

  getMovements() {
    this.movements = [];
    this.movementsFiltered = [];
    this.walletService
      .transactionsByWalletId(
        this.wallet.id!,
        this.filter,
        this.offset,
        this.limit,
        0,
        0
      )
      .subscribe({
        next: (response) => {
          this.pagesArray = [];
          this.movements = response.walletTransactions;
          this.movementsFiltered = response.walletTransactions;

          this.movementsFiltered = this.movementsFiltered.filter(
            (mov) =>
              mov.reason === 'refund' && mov.reasonStatusTransfer === 'payment'
          );

          this.cashBack = this.movementsFiltered.reduce(
            (acc, mov) => acc + mov.amount,
            0
          );

          this.totalRecords = response.total;
          this.pages = Math.ceil(response.total / this.limit);
          if (this.pages <= 1) this.pages = 1;
          for (let i = 1; i <= this.pages; i++) {
            this.pagesArray.push(i);
          }
        },
      });
  }

  filterMovements(filter: 'all' | 'received' | 'paid' | 'standby') {
    this.page = 1;
    this.pages = 0;
    this.limit = 10;
    this.offset = 0;
    this.filter = filter;
    this.getMovements();
  }

  pagination(page: number) {
    if (this.page === page) return;
    this.page = page;
    this.offset = this.limit * this.page - this.limit;
    this.getMovements();
  }

  acceptTranferATM(mov: WalletTransaction) {
    let userId = '';
    let transactionType: 'send' | 'receive' | '' = '';
    this.tranferATMaccepted = {} as WalletTransaction;
    let nameFrom = '';
    let isBussines = false;

    if (
      mov.status === 2 &&
      mov.walletTo === this.wallet.id &&
      mov.transactionType === 'send'
    ) {
      transactionType = 'receive';
      userId = mov.userIdFrom!;
    }

    if (
      mov.status === 2 &&
      mov.walletFrom === this.wallet.id &&
      mov.transactionType === 'receive'
    ) {
      transactionType = 'send';
      userId = mov.userIdTo!;
    }

    this.walletService
      .acceptTranferATM(mov.id)
      .pipe(
        switchMap((responseTransfer) => {
          this.tranferATMaccepted = responseTransfer;

          const checkUserIdTo = userId.charAt(userId.length - 1);

          if (checkUserIdTo === 'B' || checkUserIdTo === 'P') isBussines = true;

          if (mov.isBussines || isBussines)
            return this.companyService.getCompanyByUserId(userId);
          return this.userService.getUserByUserID(userId);
        })
      )
      .subscribe({
        next: (response: any) => {
          if (!mov.isBussines && !isBussines) {
            nameFrom = `${response.profile?.name!} ${response.profile
              ?.lastName!}`;
          }

          if (mov.isBussines || isBussines) {
            nameFrom = `${response.profile?.name!}`;
          }

          if (nameFrom === '' || nameFrom === ' ' || !nameFrom) {
            nameFrom = `${response.country.phonePrefix}${response.phoneNumber}`;
          }

          this.getMovements();
          this.getWalletById();

          this.modalAcceptAtmSuccessfully(
            this.tranferATMaccepted.amountNet,
            'accept',
            transactionType,
            nameFrom
          );
        },
      });
  }

  declineTranferATM(mov: WalletTransaction) {
    this.tranferATMaccepted = {} as WalletTransaction;
    let userId = '';
    let transactionType: 'send' | 'receive' | '' = '';
    let nameFrom = '';
    let isBussines = false;

    if (
      mov.status === 2 &&
      mov.walletTo === this.wallet.id &&
      mov.transactionType === 'send'
    ) {
      transactionType = 'receive';
      userId = mov.userIdFrom!;
    }

    if (
      mov.status === 2 &&
      mov.walletFrom === this.wallet.id &&
      mov.transactionType === 'receive'
    ) {
      transactionType = 'send';
      userId = mov.userIdTo!;
    }

    this.walletService
      .declineTranferATM(mov.id)
      .pipe(
        switchMap((responseTransfer) => {
          this.tranferATMaccepted = responseTransfer;

          const checkUserIdTo = userId.charAt(userId.length - 1);
          if (checkUserIdTo === 'B' || checkUserIdTo === 'P') isBussines = true;

          if (mov.isBussines || isBussines)
            return this.companyService.getCompanyByUserId(userId);
          return this.userService.getUserByUserID(userId);
        })
      )
      .subscribe({
        next: (response: any) => {
          if (!mov.isBussines && !isBussines) {
            nameFrom = `${response.profile?.name!} ${response.profile
              ?.lastName!}`;
          }

          if (mov.isBussines || isBussines) {
            nameFrom = `${response.profile?.name!}`;
          }

          this.getMovements();
          this.getWalletById();

          this.modalAcceptAtmSuccessfully(
            this.tranferATMaccepted.amountNet,
            'decline',
            transactionType,
            nameFrom
          );
        },
      });
  }

  getWalletById() {
    this.walletService.findWalletById(this.wallet.id!).subscribe({
      next: (response) => {
        this.walletService.myWalletSet(response);
      },
    });
  }

  async modalAcceptAtmSuccessfully(
    amount: number,
    action: 'accept' | 'decline',
    transactionType: 'send' | 'receive' | '',
    nameFrom: string
  ) {
    this.modalController.dismiss();
    const modal = await this.modalController.create({
      component: AcceptAtmSuccessfullyComponent,
      backdropDismiss: true,
      componentProps: { amount, nameFrom, action, transactionType },
      cssClass: 'modal-accept-atm-success',
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
  }
}
