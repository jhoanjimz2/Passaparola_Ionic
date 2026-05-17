import {
  HttpClient,
  HttpContext,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable, catchError, map, throwError } from 'rxjs';

import { environment } from 'src/environments/environment';
import { API_TOKEN } from 'src/app/core/interceptors/http.interceptor.service';
import { Wallet } from '../interfaces/wallet/wallet.interface';
import { WinsResponse } from '../interfaces/wins/wins-response.interface';
import { WalletTransactionsResponse } from '../interfaces/wallet/wallet-transaction-response.interface';
import { TransferATMRequets } from '../interfaces/wallet/requets/transfer-atm-requets.interface';
import { TransferATMResponse } from '../interfaces/wallet/response/transfer-atm-response.interface';
import { WalletTransaction } from '../interfaces/wallet/wallet-transaction.interface';
import { WorldRewardPoints } from '../interfaces/wallet/world-reward-points.interface';
import { MainWallets } from '../interfaces/wallet/main-wallets.interface';
import { TransferRecharge } from '../interfaces/wallet/transfer-recharge.interface';
import { PassaparolaCard } from '../interfaces/passaparolaCard/passaparola-card.interface';
import { WithdrawTransfer } from '../interfaces/wallet/withdraw-transfer';
import { DailyCheckIn } from '../interfaces/daily-checkin/daily-ckeck-in.interface';
import { WithdrawReward } from '../interfaces/wallet/withdraw-reward.interface';

@Injectable({
  providedIn: 'root',
})
export class WalletService {
  private myWallet: BehaviorSubject<any>;

  constructor(private http: HttpClient) {
    this.myWallet = new BehaviorSubject(false);
  }

  createWallet(wallet: Wallet) {
    return this.http
      .post<Wallet>(`${environment.apiUnika}/wallet`, wallet, {
        context: new HttpContext().set(API_TOKEN, { krathemisBasic: true }),
      })
      .pipe(
        map((response) => {
          return response;
        })
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  authWallet() {
    return this.http
      .post<any>(
        `${environment.apiUnika}/auth/authentication`,
        {},
        {
          context: new HttpContext().set(API_TOKEN, { krathemis: true }),
        }
      )
      .pipe(
        map((response) => {
          localStorage.setItem(
            'appPassaparola_walletBasicToken',
            response.token
          );
          return response;
        })
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  loginWallet(payload: string) {
    return this.http
      .post<any>(`${environment.apiUnika}/auth/login`, { payload })
      .pipe(
        map((response) => {
          localStorage.setItem('appPassaparola_walletToken', response.token);
          return response;
        })
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  findWalletById(id: string) {
    return this.http
      .get<Wallet>(`${environment.apiUnika}/wallet/${id}`, {
        context: new HttpContext().set(API_TOKEN, { krathemis: true }),
      })
      .pipe(
        map((response) => {
          return response;
        })
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  findWalletsByUserId(userId: string) {
    return this.http
      .get<Wallet[]>(
        `${environment.apiUnika}/wallet/find-wallets-by-user-id/${userId}`,
        {
          context: new HttpContext().set(API_TOKEN, { krathemis: true }),
        }
      )
      .pipe(
        map((response) => {
          const wallets = response.filter(
            (wallet) => !wallet.isInvestment && !wallet.isNik
          );
          return wallets;
        })
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  findWalletByUserIdAndProg(code: string) {
    return this.http
      .get<Wallet>(
        `${environment.apiUnika}/wallet/find-one-by-userId-and-prog/${code}`,
        {
          context: new HttpContext().set(API_TOKEN, { krathemis: true }),
        }
      )
      .pipe(
        map((response) => {
          return response;
        })
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  findDefaultWallet(userId: string) {
    return this.http
      .get<Wallet>(
        `${environment.apiUnika}/wallet/find-default-wallet/${userId}`,
        {
          context: new HttpContext().set(API_TOKEN, { krathemis: true }),
        }
      )
      .pipe(
        map((response) => {
          return response;
        })
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  findWinsByUserId(userId: string) {
    return this.http
      .get<WinsResponse>(
        `${environment.apiUnika}/wallet/wins-by-user-id/${userId}`,
        {
          context: new HttpContext().set(API_TOKEN, { krathemis: true }),
          params: {
            limit: 100,
            offset: 0,
            keyword: '',
            dateFrom: '',
            dateTo: '',
            languageCode: localStorage.getItem('language')
              ? localStorage.getItem('language')!
              : 'it',
          },
        }
      )
      .pipe(
        map((response) => {
          return response;
        })
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  findDrawingtWallet() {
    return this.http
      .get<Wallet>(`${environment.apiUnika}/wallet/find/wallet-drawing`, {
        context: new HttpContext().set(API_TOKEN, { krathemis: true }),
      })
      .pipe(
        map((response) => {
          return response;
        })
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  transactionsByWalletId(
    walletId: string,
    filter: 'all' | 'received' | 'paid' | 'standby',
    offset: number,
    limit: number,
    month: number,
    year: number
  ) {
    return this.http
      .get<WalletTransactionsResponse>(
        `${environment.apiUnika}/wallet/transactions-by-wallet-id/${walletId}/${filter}`,
        {
          context: new HttpContext().set(API_TOKEN, { krathemis: true }),
          params: {
            limit,
            offset,
            keyword: '',
            dateFrom: '',
            dateTo: '',
            month,
            year,
            languageCode: localStorage.getItem('language')
              ? localStorage.getItem('language')!
              : 'it',
          },
        }
      )
      .pipe(
        map((response) => {
          return response;
        })
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  transferATM(transferRequets: TransferATMRequets) {
    return this.http
      .post<TransferATMResponse>(
        `${environment.apiUnika}/wallet/transfer-atm`,
        transferRequets,
        {
          context: new HttpContext().set(API_TOKEN, { krathemis: true }),
        }
      )
      .pipe(
        map((response) => {
          return response;
        })
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  acceptTranferATM(id: string) {
    return this.http
      .get<WalletTransaction>(
        `${environment.apiUnika}/wallet/accept-transaction/${id}`,
        {
          context: new HttpContext().set(API_TOKEN, { krathemis: true }),
        }
      )
      .pipe(
        map((response) => {
          return response;
        })
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  declineTranferATM(id: string) {
    return this.http
      .get<WalletTransaction>(
        `${environment.apiUnika}/wallet/decline-transaction/${id}`,
        {
          context: new HttpContext().set(API_TOKEN, { krathemis: true }),
        }
      )
      .pipe(
        map((response) => {
          return response;
        })
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  findWorldRewardPointsByCountry(codeCountry: string) {
    return this.http
      .get<WorldRewardPoints[]>(
        `${environment.apiUnika}/wallet/find/world-reward-points-by-country/${codeCountry}`,
        {
          context: new HttpContext().set(API_TOKEN, { krathemis: true }),
        }
      )
      .pipe(
        map((response) => {
          return response;
        })
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  findMainWallets() {
    return this.http
      .get<MainWallets>(`${environment.apiUnika}/wallet/find/main-wallets`, {
        context: new HttpContext().set(API_TOKEN, { krathemis: true }),
      })
      .pipe(
        map((response) => {
          return response;
        })
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  myWalletWatch(): Observable<any> {
    return this.myWallet.asObservable();
  }

  myWalletSet(value: Wallet) {
    localStorage.setItem('walletSelected', JSON.stringify(value));
    this.myWallet.next(value);
  }

  createWalletRecharges(wallet: Wallet) {
    return this.http
      .post<Wallet>(`${environment.apiUnika}/wallet/recharge`, wallet, {
        context: new HttpContext().set(API_TOKEN, { krathemis: true }),
      })
      .pipe(
        map((response) => {
          return response;
        })
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  findWalletsRechargeByUserId(userId: string) {
    return this.http
      .get<Wallet[]>(
        `${environment.apiUnika}/wallet/find-recharge-wallet/${userId}`,
        {
          context: new HttpContext().set(API_TOKEN, { krathemis: true }),
        }
      )
      .pipe(
        map((response) => {
          return response;
        })
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  rechargesByWalletId({ walletId, offset, limit }: any) {
    return this.http
      .get<WalletTransactionsResponse>(
        `${environment.apiUnika}/wallet/recharges-by-wallet-id/${walletId}/all`,
        {
          context: new HttpContext().set(API_TOKEN, { krathemis: true }),
          params: {
            limit,
            offset,
            keyword: '',
            dateFrom: '',
            dateTo: '',
            languageCode: localStorage.getItem('language')
              ? localStorage.getItem('language')!
              : 'it',
          },
        }
      )
      .pipe(
        map((response) => {
          return response;
        })
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  renewTokenWallet() {
    return this.http
      .post<any>(
        `${environment.apiUnika}/auth/renew-token`,
        {},
        {
          context: new HttpContext().set(API_TOKEN, { krathemis: true }),
        }
      )
      .pipe(
        map((response) => {
          localStorage.setItem('appPassaparola_walletToken', response.token);
          return response;
        })
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  createTransferRecharge(transferRecharge: TransferRecharge) {
    return this.http
      .post<TransferRecharge>(
        `${environment.apiUnika}/wallet/transfer-recharge`,
        transferRecharge,
        {
          context: new HttpContext().set(API_TOKEN, { krathemis: true }),
        }
      )
      .pipe(
        map((response) => {
          return response;
        })
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  getPassaparolaCard(card: string) {
    return this.http
      .get<PassaparolaCard>(
        `${environment.apiUnika}/passaparola-card/${card}`,
        {
          context: new HttpContext().set(API_TOKEN, { krathemis: true }),
        }
      )
      .pipe(
        map((response) => {
          return response;
        })
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  assingPassaparolaCard(userId: string, cardId: string, countryCode: string) {
    return this.http
      .post<PassaparolaCard>(
        `${environment.apiUnika}/passaparola-card/assing`,
        {
          userId,
          cardId,
          countryCode,
        },
        {
          context: new HttpContext().set(API_TOKEN, { krathemis: true }),
        }
      )
      .pipe(
        map((response) => {
          return response;
        })
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  createWithdrawTransfer(withdrawTransfer: WithdrawTransfer) {
    return this.http
      .post<WithdrawTransfer>(
        `${environment.apiUnika}/wallet/withdraw-transfer`,
        withdrawTransfer,
        {
          context: new HttpContext().set(API_TOKEN, { krathemis: true }),
        }
      )
      .pipe(
        map((response) => {
          return response;
        })
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  createDailyCheckIn(dailyCheckIn: DailyCheckIn) {
    return this.http
      .post<WithdrawTransfer>(
        `${environment.apiUnika}/wallet/daily-check-in`,
        dailyCheckIn,
        {
          context: new HttpContext().set(API_TOKEN, { krathemis: true }),
        }
      )
      .pipe(
        map((response) => {
          return response;
        })
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  getDailyCheckIns(userId: string, month: number, year: number) {
    return this.http
      .get<DailyCheckIn[]>(
        `${environment.apiUnika}/wallet/find-all-daily-check-in/${userId}/${month}/${year}`,
        {
          context: new HttpContext().set(API_TOKEN, { krathemis: true }),
        }
      )
      .pipe(
        map((response) => {
          return response;
        })
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  createWithdrawReward(withdrawReward: WithdrawReward) {
    return this.http
      .post<WithdrawTransfer>(
        `${environment.apiUnika}/wallet/withdraw-reward`,
        withdrawReward,
        {
          context: new HttpContext().set(API_TOKEN, { krathemis: true }),
        }
      )
      .pipe(
        map((response) => {
          return response;
        })
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  checkWithdrawReward() {
    return this.http
      .get<any>(`${environment.apiUnika}/wallet/withdraw-reward/check`, {
        context: new HttpContext().set(API_TOKEN, { krathemis: true }),
      })
      .pipe(
        map((response) => {
          return response;
        })
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }
}
