import { Injectable }                                                                   from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { Wallet }                                                                       from '../interfaces/wallet/wallet.interface';
import { HttpClient, HttpContext, HttpErrorResponse }                                   from '@angular/common/http';
import { environment }                                                                  from 'src/environments/environment';
import { API_TOKEN }                                                                    from 'src/app/core/interceptors/http.interceptor.service';
import { User }                                                                         from '../interfaces/user/user.interface';
import { StripeService }                                                                from './stripe.service';
import { BankCardService }                                                              from './bank-card.service';
import { IResponseBankCard }                                                            from '../interfaces/bank-card/bank-card.interface';
import { BankCard }                                                                     from '../interfaces/payments/payment-selection.interface';
import { MainWallets }                                                                  from '../interfaces/wallet/main-wallets.interface';

@Injectable({
  providedIn: 'root'
})
export class PaymentsService {

  private user: User = {} as User;
  private walletSelected$ = new BehaviorSubject<Wallet>({} as Wallet);
  private mainWallets$ = new BehaviorSubject<MainWallets>({} as MainWallets);
  private bankCards$ = new BehaviorSubject<BankCard[]>([]);


  constructor(
    private http: HttpClient,
    private stripeService: StripeService,
    private bankCardService: BankCardService,
  ) {
    this.user = JSON.parse(localStorage.getItem('appPassaparola_user')!);
  }

  mainWallets(): Observable<MainWallets> {
    return this.mainWallets$.asObservable();
  }
  walletSelected(): Observable<Wallet> {
    return this.walletSelected$.asObservable();
  }
  bankCards(): Observable<BankCard[]> {
    return this.bankCards$.asObservable();
  }

  getMainWallets() {
    return this.http
      .get<MainWallets>(`${environment.apiUnika}/wallet/find/main-wallets`, {
        context: new HttpContext().set(API_TOKEN, { krathemis: true }),
      })
      .pipe(tap((wallets: MainWallets) => this.mainWallets$.next(wallets)))
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }


  getWalletSelected() {
    return this.http
      .get<Wallet[]>(
        `${environment.apiUnika}/wallet/find-wallets-by-user-id/${this.user
          .userID!}`,
        { context: new HttpContext().set(API_TOKEN, { krathemis: true }) }
      )
      .pipe(
        map((response: Wallet[]) => {
          const wallets = response.filter(
            (wallet) => !wallet.isInvestment && !wallet.isNik
          );
          const defaultWallet = wallets.find((wallet) => wallet.default);
          this.walletSelected$.next(defaultWallet ?? wallets[0]);
        })
      )
      .pipe(catchError((error: HttpErrorResponse) => throwError(() => error)));
  }

  getCardsBank() {
    return this.bankCardService
      .findAll({
        filterUser: true,
        offset: 1,
        limit: 1000,
      })
      .pipe(
        map(({ data }: IResponseBankCard) =>
          data.map(card => card.idStripe)
        ),
        switchMap((customerIds: string[]) =>
          this.stripeService.getPaymentMethods(customerIds)
        ),
        map(response =>
          response.flatMap(data =>
            data.data.map((card: any) => ({
              brand: card.card.brand.toUpperCase(),
              cardNumber: `**** **** **** ${card.card.last4}`,
              expiration: `${card.card.exp_month}/${card.card.exp_year.toString().slice(-2)}`,
              owner: card.billing_details.name,
              customer: card.customer,
              id: card.id,
            }))
          )
        ),
        tap(bankCards => this.bankCards$.next(bankCards)),
        catchError(error => {
          this.bankCards$.next([]);
          return of([]);
        })
      )
  }


}
