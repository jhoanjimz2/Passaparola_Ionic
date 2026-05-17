import { App }                             from '@capacitor/app';
import { Component, OnInit, ViewChild }    from '@angular/core';
import {
  AlertController,
  MenuController,
  ModalController,
  NavController,
  Platform,
} from '@ionic/angular';
import { Geolocation }                     from '@capacitor/geolocation';
import { Camera }                          from '@capacitor/camera';

import { Subscription }                    from 'rxjs';
import { NgxScannerQrcodeComponent }       from 'ngx-scanner-qrcode';
import { TranslateService }                from '@ngx-translate/core';

import { InitialModalInfoComponent }       from 'src/app/components/initial-modal-info/initial-modal-info.component';
import { WalletService, WebsocketService } from 'src/app/shared/services';
import { AuthenticationService }           from 'src/app/core/service/authentication.service';
import { DailyCheckIn }                    from 'src/app/shared/interfaces/daily-checkin/daily-ckeck-in.interface';
import { User }                            from 'src/app/shared/interfaces/user/user.interface';
import { CalendarComponent }               from '../main/components/calendar/calendar.component';
import { Company }                         from 'src/app/shared/interfaces/company/company.interface';
import { OnboardingComponent }             from 'src/app/components/onboarding/onboarding.component';
import { NotificationsPushService }        from 'src/app/shared/services/notificaions-push.service';
import { PreferenceFeedSocialComponent }   from 'src/app/components/preference-feed-social/preference-feed-social.component';
import { SessionService }                  from 'src/app/shared/services/session.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.page.html',
  styleUrls: ['./layout.page.scss'],
})
export class LayoutPage implements OnInit {
  backButtonSubscribe: Subscription | undefined;
  @ViewChild('actionCameraInit', { static: true })
  actionCameraInit!: NgxScannerQrcodeComponent;
  dailyCheckIns: DailyCheckIn[] = [];
  user: User | Company | undefined;
  today = new Date();
  year = 0;
  month = 0;
  isCompany = false;

  constructor(
    private platform: Platform,
    private modalController: ModalController,
    private menu: MenuController,
    private websocketService: WebsocketService,
    private authenticationService: AuthenticationService,
    private translate: TranslateService,
    private navController: NavController,
    private alertController: AlertController,
    private walletService: WalletService,
    private notificationsPushService: NotificationsPushService,
    public sessionService: SessionService
  ) {}

  ngOnInit() {
    this.notificationsPushService.registerNotifications();
    const user = localStorage.getItem('appPassaparola_user');
    this.user = user ? JSON.parse(user) : undefined;
    this.year = this.today.getFullYear();
    this.month = this.today.getMonth();
    this.isCompany =
      this.user?.rol === 'company' || this.user?.rol === 'professional'
        ? true
        : false;

    // this.subscribeBackButton();
    // this.websocketService.conectToServer(this.authenticationService.userToken);
    this.menu.swipeGesture(false);
    // this.requestPermissionsApp();
    // this.modalInfo();

    setTimeout(() => {
      if (!this.isCompany) this.getDailyCheckIn();
    }, 5000);
  }

  async requestPermissionCamera() {
    const platforms = this.platform.platforms();
    if (platforms.includes('mobileweb')) {
      try {
        const result = await navigator.permissions.query({
          name: 'camera' as PermissionName,
        });
        if (result.state === 'granted') {
          return;
        } else if (result.state === 'denied') {
          const playDeviceFacingBack = () => {};
          this.actionCameraInit
            .start(playDeviceFacingBack)
            .subscribe((r: any) => {
              this.actionCameraInit.stop();
            });
          return;
        } else {
          const playDeviceFacingBack = () => {};
          this.actionCameraInit
            .start(playDeviceFacingBack)
            .subscribe((r: any) => {
              this.actionCameraInit.stop();
            });
          return;
        }
      } catch (error) {
        console.error(error);
        return;
      }
    }

    // capacitor android/ios
    const checkPermissions = await Camera.checkPermissions();
    if (checkPermissions) {
      if (checkPermissions.camera === 'granted') return;
    }
    const permission = await Camera.requestPermissions();
  }

  async requestPermissionsLocation() {
    const checkPermissions = await Geolocation.checkPermissions();
    if (checkPermissions) {
      if (checkPermissions.location === 'granted') return;
    }
    const permission = await Geolocation.requestPermissions();
  }

  requestPermissionsApp() {
    // this.requestPermissionsLocation();
    this.requestPermissionCamera();
  }

  async modalInfo() {
    this.modalController.dismiss();
    const modal = await this.modalController.create({
      component: InitialModalInfoComponent,
      backdropDismiss: false,
      componentProps: {},
      cssClass: 'modal-transparent-90vh',
      canDismiss: false,
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
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
          currentUrl === '/main' ||
          currentUrl === '/social' ||
          currentUrl === '/stores' ||
          currentUrl === '/map' ||
          currentUrl === '/mega-stores' ||
          currentUrl === '/external-stores' ||
          currentUrl === '/wallet' ||
          currentUrl === '/community' ||
          currentUrl === '/investimenti' ||
          currentUrl === '/tpv' ||
          currentUrl === '/recharges' ||
          currentUrl === '/'
        ) {
          this.logout();
          return;
        }

        // if (currentUrl === '/login') {
        //   this.navController.navigateBack(['/start']);
        //   return;
        // }
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
        // this.navController.pop();
      }
    );
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

  getDailyCheckIn() {
    this.walletService
      .getDailyCheckIns(this.user?.userID!, this.month + 1, this.year)
      .subscribe({
        next: (response) => {
          if (response) {
            this.dailyCheckIns = response;

            const isCheckToday = this.checkIfTodayIsCheckedIn();

            if (!isCheckToday) {
              this.modalCalendar();
            } else {
              this.checkDataUser();
            }
          } else {
            this.checkDataUser();
          }
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  async modalCalendar() {
    const modal = await this.modalController.create({
      component: CalendarComponent,
      cssClass: 'modal-calendar',
      backdropDismiss: true,
      componentProps: { dailyCheckIns: this.dailyCheckIns },
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();

    setTimeout(() => {
      this.checkDataUser();
    }, 1500);
  }

  checkIfTodayIsCheckedIn() {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (const checkIn of this.dailyCheckIns) {
      const checkInDate = new Date(checkIn.date);
      checkInDate.setHours(0, 0, 0, 0);

      if (currentDate.getTime() === checkInDate.getTime()) return true;
    }

    return false;
  }

  checkDataUser() {
    const isCompany =
      this.user?.rol === 'company' || this.user?.rol === 'professional'
        ? true
        : false;

    if (!isCompany) {
      const name = this.user?.profile?.name;
      const lastName = (this.user as User).profile?.lastName;
      const username = (this.user as User).profile?.username;
      const profilePictureUrlFile = (this.user as User).profile
        ?.profilePictureUrlFile;

      if (!name || !username || !profilePictureUrlFile) {
        this.modalOnboarding();
      } else {
        const appPassaparola_preferenceFeed = localStorage.getItem(
          'appPassaparola_preferenceFeed'
        );
        if (!appPassaparola_preferenceFeed && this.sessionService.isUser) this.modalSetPreferenceFeed();
      }
    }
  }

  async modalOnboarding() {
    const modal = await this.modalController.create({
      component: OnboardingComponent,
      cssClass: 'modal-onboarding',
      backdropDismiss: false,
      componentProps: { user: this.user },
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();
  }


  async modalSetPreferenceFeed() {
    const modal = await this.modalController.create({
      component: PreferenceFeedSocialComponent,
      cssClass: ['radius-modals', 'modal-75vh'],
      breakpoints: [0,1],
      initialBreakpoint: 1,
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    localStorage.setItem('appPassaparola_preferenceFeed', 'true')
  }
}
