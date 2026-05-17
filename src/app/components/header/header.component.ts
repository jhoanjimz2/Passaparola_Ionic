import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnDestroy,
} from '@angular/core';

import { MenuController, ModalController, NavController } from '@ionic/angular';

import { TranslateService }                               from '@ngx-translate/core';
import { Subscription }                                   from 'rxjs';

import { environment }                                    from 'src/environments/environment';
import { AuthenticationService }                          from 'src/app/core/service/authentication.service';
import { QrCodeComponent }                                from 'src/app/components/qr-code/qr-code.component';
import { Profile }                                        from 'src/app/shared/interfaces/user/profile.interface';
import { User }                                           from 'src/app/shared/interfaces/user/user.interface';
import { CryptoService }                                  from 'src/app/shared/services';
import { Company }                                        from 'src/app/shared/interfaces/company/company.interface';
import { NotificationsConfigComponent }                   from '../notifications-config/notifications-config.component';
import { PhysicalBusinessComponent }                      from 'src/app/home/map/pages/physical-business/physical-business.component';
import { MapViewPage }                                    from 'src/app/home/map/components/map-view/map-view.page';
import { SessionService }                                 from 'src/app/shared/services/session.service';
import { PreferenceFeedSocialComponent }                  from '../preference-feed-social/preference-feed-social.component';
import { RequestTagsService }                             from 'src/app/shared/services/request-tags.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() backIcon = false;
  @Input() border = false;
  @Input() buttonMenu = false;
  @Input() modalDismiss = false;
  @Input() valueEmit: any = '';
  @Input() modalQRActive = false;
  @Output() emitAnyValue: EventEmitter<any> = new EventEmitter<any>();
  @Input() urlBack = '';
  @Input() modalNotificationConfigActive = false;
  @Input() returnModal = '';

  user: User | Company = {} as any;
  profile: Profile | null = null;
  subscriptionMyUser: Subscription | undefined;

  constructor(
    public menuCtrl: MenuController,
    public sessionService: SessionService,
    private navController: NavController,
    private authenticationService: AuthenticationService,
    private requestTagsService: RequestTagsService,
    private translate: TranslateService,
    private modalController: ModalController,
    private cryptoService: CryptoService,
  ) {
    this.user = this.authenticationService.user;
  }

  ngOnInit() {
    this.profile = this.user.profile!;
    this.myUserWatch();
  }

  async ngOnDestroy() {
    if (this.returnModal === 'PhysicalBusinessComponent') {
      const modal = await this.modalController.create({
        component: PhysicalBusinessComponent,
      });

      modal.present();
    }

    if (this.returnModal === 'MapViewPage') {
      const modal = await this.modalController.create({
        component: MapViewPage,
        backdropDismiss: true,
        cssClass: 'modal-full-screen',
        componentProps: {
          showHeader: true,
          returnModal: 'MapViewPage',
        },
      });
      await modal.present();

      modal.present();
    }
  }

  get sedeOperativa():boolean {
    return !!localStorage.getItem('appPassaparola_isLoginSeat')
  }

  get profileOperative(): any {
    return JSON.parse(localStorage.getItem('appPassaparola_loginSeat')!) || {}
  }

  async onOpenModalQrCode() {
    if (this.modalQRActive) return;

    const user = localStorage.getItem('appPassaparola_user');
    const userIdEncrypt = this.cryptoService.encrypt(JSON.parse(user!).userID);
    const url = userIdEncrypt
      ? `${environment.urlRegister}/sing-up?promoCode=${userIdEncrypt}`
      : `${environment.urlRegister}/sing-up`;

    const modal = await this.modalController.create({
      component: QrCodeComponent,
      backdropDismiss: true,
      componentProps: {
        title: this.translate.instant('QR_CODE.TITLE'),
        subTitle: this.translate.instant('QR_CODE.SUB_TITLE'),
        label: this.translate.instant('QR_CODE.LABEL'),
        textToCopy: url,
        textToShow: userIdEncrypt,
      },
    });
    await modal.present();
  }

  myUserWatch() {
    this.subscriptionMyUser = this.authenticationService
      .myUserWatch()
      .subscribe((user: User) => {
        if (!user) return;
        this.user = user;
        this.profile = this.user.profile!;
      });
  }

  goProfile() {
    console.log(this.sessionService.isCompanyLegal, this.sessionService.isProfessionalAdministrative)
    if (this.sessionService.isCompanyOperative || this.sessionService.isProfessionalOperative) {
      this.navController.navigateForward(['/pages/company/seat/modify', this.profileOperative.id], {
        queryParams: { operative: true },
      });
      return;
    }
    if (this.sessionService.isCompanyLegal || this.sessionService.isProfessionalAdministrative) {
      // const user = JSON.parse(localStorage.getItem('appPassaparola_user')!);
      // this.navController.navigateForward(['/pages/company/seat/modify-simple', user.id]);
      return;
    }
    if (this.sessionService.isUser) {
      const user = JSON.parse(localStorage.getItem('appPassaparola_user')!);
      this.navController.navigateForward(['/pages/company/seat/modify-simple', user.id]);
      return;
    }
  }

  back() {
    if (this.valueEmit) {
      this.emitAnyValue.emit(this.valueEmit);
      return;
    }

    if (this.modalDismiss) {
      this.modalController.dismiss();
      return;
    }

    if (this.urlBack) {
      this.navController.navigateBack([this.urlBack]);
      return;
    }

    const currentUrl = localStorage.getItem('appPassaparola_currentUrl');
    const previousUrl = localStorage.getItem('appPassaparola_previousUrl');

    if (
      currentUrl === '/pages/profile/identity' ||
      currentUrl === '/pages/profile/contact' ||
      currentUrl === '/pages/profile/security-account' ||
      currentUrl === '/pages/bank-card' ||
      currentUrl === '/pages/bank-account' ||
      currentUrl === '/pages/bank-card/list' ||
      currentUrl === '/pages/bank-account/list'
    ) {
      if (this.sessionService.isCompanyLegal) {
        this.navController.navigateBack(['/main']);
      } else if (this.sessionService.isProfessionalAdministrative) {
        this.navController.navigateBack(['/wallet']);
      } else {
        this.navController.navigateBack(['/social']);
      }
      return;
    }

    if (currentUrl === '/pages/bank-card/create') {
      this.navController.navigateBack(['/pages/bank-card/list']);
      return;
    }

    if (currentUrl === '/pages/bank-account/create') {
      this.navController.navigateBack(['/pages/bank-account/list']);
      return;
    }

    if (
      currentUrl?.includes('/pages/company/seat/modify/') &&
      (currentUrl?.includes('detail=true') || currentUrl?.includes('operative=true'))
    ) {
      this.navController.back();
      return;
    }

    if (currentUrl?.includes('/pages/company/seat/modify/')) {
      this.navController.navigateBack(['/pages/company/seat']);
      return;
    }

    if (
      currentUrl === '/pages/company/seat' &&
      previousUrl?.includes('/pages/company/seat/modify/')
    ) {
      if (this.sessionService.isCompanyLegal) {
        this.navController.navigateBack(['/main']);
      } else if (this.sessionService.isProfessionalAdministrative) {
        this.navController.navigateBack(['/wallet']);
      } else {
        this.navController.navigateBack(['/social']);
      }
      return;
    }

    this.navController.back();
  }

  async onOpenModalNotificationsConfig() {
    if (this.modalNotificationConfigActive) return;

    const user = localStorage.getItem('appPassaparola_user');

    const modal = await this.modalController.create({
      component: NotificationsConfigComponent,
      backdropDismiss: true,
      componentProps: {
        user,
      },
    });
    await modal.present();
  }

  async modalSetPreferenceFeed() {
    const modal = await this.modalController.create({
      component: PreferenceFeedSocialComponent,
      cssClass: ['radius-modals', 'modal-75vh'],
      breakpoints: [0,1],
      initialBreakpoint: 1,
    });
    await modal.present();
  }

  logout() {
    this.authenticationService.logout();
    this.requestTagsService.clearAllStates();
  }
}
