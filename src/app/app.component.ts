import { App, URLOpenListenerEvent }            from '@capacitor/app';
import {
  AlertController,
  ModalController,
  NavController,
  Platform,
} from '@ionic/angular';
import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { SplashScreen }                         from '@capacitor/splash-screen';
import { Keyboard, KeyboardResize }             from '@capacitor/keyboard';
import { Router }                               from '@angular/router';

import { Subscription }                         from 'rxjs';
import { TranslateService }                     from '@ngx-translate/core';

import {
  LanguageService,
  ShowSpinnerService,
  SmsCodeService,
  WebsocketService,
} from './shared/services';
import { RouterService }                        from './shared/services/router.service';
import { AuthenticationService }                from './core/service/authentication.service';
import { CustomIconsService }                   from './shared/services/custom-icons.service';
import { ModalSplashScreenComponent }           from './components/modal-splash-screen/modal-splash-screen.component';
import { PaymentNotificationComponent }         from './home/payment/components/client/payment-notification/payment-notification.component';
import { PaymentSuccessNotificationComponent }  from './home/payment/components/business/payment-success-notification/payment-success-notification.component';
import { PaymentCancelNotificationComponent }   from './home/payment/components/business/payment-cancel-notification/payment-cancel-notification.component';
import { Capacitor }                            from '@capacitor/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  backButtonSubscribe: Subscription | undefined;
  public appReady = false;
  showSpinner = true;
  showSpinnerSubscription: Subscription | undefined;

  constructor(
    private languageService: LanguageService,
    public platform: Platform,
    private navController: NavController,
    private router: Router,
    private routerService: RouterService,
    private modalController: ModalController,
    private alertController: AlertController,
    private authenticationService: AuthenticationService,
    private translate: TranslateService,
    public customIconsService: CustomIconsService,
    private websocketService: WebsocketService,
    private zone: NgZone,
    private showSpinnerService: ShowSpinnerService,
    private smsCodeService: SmsCodeService
  ) {
    this.setupDeepLinks();
    SplashScreen.hide();
    this.smsCodeService.startSMSListener();
    this.subscribeBackButton();
    this.languageService.setLanguage();
    this.authenticationService.basicAuth().subscribe();
    this.routerService.getUrlsRouter();
    Keyboard.setScroll({ isDisabled: true });
    if (Capacitor.isNativePlatform()) {
      Keyboard.setScroll({ isDisabled: true });
    }
    this.checkLoginSeat();
    if (Capacitor.getPlatform() === 'android') {
      Keyboard.setResizeMode({ mode: KeyboardResize.None });
    }
  }

  ngOnDestroy(): void {
    this.showSpinnerSubscription?.unsubscribe();
  }

  async ngOnInit() {
    this.checkSplashScreen();
    this.socketCashPaymentWatch();
    this.socketPaymentWatch();
    this.socketCancelPaymentWatch();
    this.showSpinnerSubscribe();
  }

  setupDeepLinks() {
    App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
      this.zone.run(() => {
        try {
          const parsedUrl = new URL(event.url);
          const pathname = parsedUrl.pathname;
          const searchParams = parsedUrl.searchParams;

          if (pathname.includes('/modify-simple')) {
            this.handleModifySimpleDeepLink(pathname, searchParams);
            return;
          }
          if (pathname.includes('/modify')) {
            this.handleModifyDeepLink(pathname, searchParams);
            return;
          }
          if (pathname.includes('/view-willbuy')) {
            this.handleJointlybuyDeepLink(pathname, searchParams);
            return;
          }

          const promoCode = searchParams.get('promoCode');
          if (promoCode) {
            this.handlePromoCodeDeepLink(promoCode);
            return;
          }

          if (pathname && pathname !== '/') {
            this.router.navigateByUrl(pathname + parsedUrl.search);
            return;
          }

        } catch (error) {
        }
      });
    });
  }

  private handleModifyDeepLink(pathname: string, searchParams: URLSearchParams) {
    const segments = pathname.split('/');
    const profileId = segments[segments.length - 1];
    if (!profileId) {
      return;
    }
    const isAuthenticated = this.authenticationService.isLoged();
    if (isAuthenticated) {
      this.router.navigate([`/pages/company/seat/modify/${profileId}`], {
        queryParams: { public: 'false', detail: true }
      });
    } else {
      this.router.navigate([`/modify/${profileId}`], {
        queryParams: { public: 'true', detail: true }
      });
    }
  }
  private handleModifySimpleDeepLink(pathname: string, searchParams: URLSearchParams) {
    const segments = pathname.split('/');
    const profileId = segments[segments.length - 1];
    if (!profileId) {
      return;
    }
    const isAuthenticated = this.authenticationService.isLoged();
    if (isAuthenticated) {
      this.router.navigate([`/pages/company/seat/modify-simple/${profileId}`], {
        queryParams: { public: 'false', detail: true }
      });
    } else {
      this.router.navigate([`/modify-simple/${profileId}`], {
        queryParams: { public: 'true', detail: true }
      });
    }
  }
  private handleJointlybuyDeepLink(pathname: string, searchParams: URLSearchParams) {
    const segments = pathname.split('/');
    const willbuyId = segments[segments.length - 1];
    if (!willbuyId) {
      return;
    }
    const isAuthenticated = this.authenticationService.isLoged();
    if (isAuthenticated) {
      this.router.navigate([`/pages/jointlybuy/view-willbuy/${willbuyId}`], {
        queryParams: { public: 'false' }
      });
    } else {
      this.router.navigate([`/view-willbuy/${willbuyId}`], {
        queryParams: { public: 'true' }
      });
    }
  }

  private handlePromoCodeDeepLink(promoCode: string) {
    this.navController.navigateRoot(['/sing-up'], {
      queryParams: { promoCode }
    });
  }

  socketCashPaymentWatch() {
    this.websocketService.socketCashPaymentWatch().subscribe((data) => {
      if (data) this.openModalCashPayment(data);
    });
  }

  socketPaymentWatch() {
    this.websocketService.socketPaymentWatch().subscribe((data) => {
      if (data) this.openModalPayment(data);
    });
  }

  socketCancelPaymentWatch() {
    this.websocketService.socketCancelPaymentWatch().subscribe((data) => {
      if (data) this.openModalCancelPayment(data);
    });
  }

  async openModalCashPayment(payload: any) {
    const modal = await this.modalController.create({
      component: PaymentNotificationComponent,
      backdropDismiss: true,
      componentProps: {
        walletTransaction: payload.walletTransaction,
        userId: payload.company.userId,
      },
      cssClass: 'modal-95vh',
    });
    await modal.present();
  }

  async openModalPayment(payload: any) {
    const arrayId = payload.walletTransaction.id.split('-');
    const idOperation = arrayId[arrayId.length - 1];

    const modal = await this.modalController.create({
      component: PaymentSuccessNotificationComponent,
      backdropDismiss: true,
      componentProps: {
        amount: payload.walletTransaction.amount,
        idOperation,
      },
      cssClass: 'modal-95vh',
    });
    await modal.present();
  }

  async openModalCancelPayment(payload: any) {
    const modal = await this.modalController.create({
      component: PaymentCancelNotificationComponent,
      backdropDismiss: true,
      componentProps: {
        amount: payload.amount,
      },
      cssClass: 'modal-95vh',
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();

    if (data?.cancel) this.navController.navigateRoot(['tpv']);

    if (data?.edit)
      this.navController.navigateRoot(['tpv'], {
        queryParams: { edit: true, amount: payload.amount },
      });

    if (data?.tryAgain)
      this.navController.navigateRoot(['tpv'], {
        queryParams: {
          tryAgain: true,
          amount: payload.amount,
          wallet: payload.wallet,
        },
      });
  }

  async closeApp() {
    const alert = await this.alertController.create({
      header: this.translate.instant('GENERAL.CLOSE_APP'),
      mode: 'ios',
      message: this.translate.instant('GENERAL.CLOSE_APP_2'),
      buttons: [
        {
          text: this.translate.instant('GENERAL.NO'),
          role: 'cancel',
          cssClass: 'botonAlert',
          handler: () => {},
        },
        {
          text: this.translate.instant('GENERAL.YES'),
          cssClass: 'botonAlert',
          handler: () => App.exitApp(),
        },
      ],
    });
    await alert.present();
  }

  async logout() {
    const alert = await this.alertController.create({
      header: this.translate.instant('GENERAL.LOGOUT'),
      mode: 'ios',
      message: this.translate.instant('GENERAL.LOGOUT_2'),
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'botonAlert',
          handler: () => {},
        },
        {
          text: 'Si',
          cssClass: 'botonAlert',
          handler: () => this.authenticationService.logout(),
        },
      ],
    });
    await alert.present();
  }

  subscribeBackButton() {
    this.backButtonSubscribe = this.platform.backButton.subscribeWithPriority(
      1,
      async () => {
        const modal = await this.modalController.getTop();
        if (modal) {
          this.modalController.dismiss();
          return;
        }

        const currentUrl = localStorage.getItem('appPassaparola_currentUrl');
        if (
          currentUrl === '/social' ||
          currentUrl === '/stores' ||
          currentUrl === '/map' ||
          currentUrl === '/mega-stores' ||
          currentUrl === '/external-stores' ||
          currentUrl === '/wallet' ||
          currentUrl === '/community' ||
          currentUrl === '/investimenti' ||
          currentUrl === '/'
        ) {
          this.logout();
          return;
        }

        if (
          currentUrl === '/login' ||
          currentUrl === '/landing' ||
          currentUrl === '/start' ||
          currentUrl === '/sing-up'
        ) {
          this.closeApp();
          return;
        }

        this.navController.back();
      }
    );
  }

  async openModalSplashScreen() {
    const modal = await this.modalController.create({
      component: ModalSplashScreenComponent,
      cssClass: 'modal-full-screen',
      id: 'modalSplashScreen',
    });
    sessionStorage.setItem('appPassaparola_splashScreen', 'true');
    return await modal.present();
  }

  async checkSplashScreen() {
    this.showSpinnerService.showSpinnerWatchSet(false);
    await this.openModalSplashScreen();
  }

  checkLoginSeat() {
    const appPassaparola_isLoginSeat = localStorage.getItem(
      'appPassaparola_isLoginSeat'
    );

    if (appPassaparola_isLoginSeat === 'true')
      this.navController.navigateRoot(['tpv']);
  }

  showSpinnerSubscribe() {
    this.showSpinnerSubscription = this.showSpinnerService
      .showSpinnerWatch()
      .subscribe((value) => {
        this.showSpinner = value;
      });
  }
}
