import { ChangeDetectorRef, Component, OnInit }     from '@angular/core';
import { ModalController, NavController, Platform } from '@ionic/angular';
import { Browser }                                  from '@capacitor/browser';
import { Subscription }                             from 'rxjs';
import { AuthenticationService }                    from 'src/app/core/service/authentication.service';
import { MenuNav }                                  from 'src/app/shared/interfaces/general/menu-nav.interface';
import { Profile }                                  from 'src/app/shared/interfaces/user/profile.interface';
import { User }                                     from 'src/app/shared/interfaces/user/user.interface';
import { CryptoService, MenuService }               from 'src/app/shared/services';
import { environment }                              from 'src/environments/environment';
import { QrCodeComponent }                          from 'src/app/home/wallet/components/qr-code/qr-code.component';
import { ListAddressesComponent }                   from '../addresses/list-addresses/list-addresses.component';
import { SeatService }                              from 'src/app/shared/services/seat.service';
import { SessionService, UserRole }                 from 'src/app/shared/services/session.service';
import { RequestTagsService }                       from 'src/app/shared/services/request-tags.service';
import { ModalChangeMultiProfileComponent }         from '../modal-change-multi-profile/modal-change-multi-profile.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  user: User = {} as User;
  profile: Profile = {} as Profile;
  subscriptionMyUser: Subscription | undefined;
  isIosPlatform = false;
  users: any[] = [];
  menu: MenuNav[] = [];
  showAddAccountBtn = false;
  mainContainerMT = 210;
  companies: any[] = [];

  constructor(
    private authenticationService: AuthenticationService,
    private navcontroller: NavController,
    private platform: Platform,
    private menuService: MenuService,
    private modalCtrl: ModalController,
    private cdr: ChangeDetectorRef,
    private cryptoService: CryptoService,
    private seatService: SeatService,
    private navCtrl: NavController,
    private requestTagsService: RequestTagsService,
    public sessionService: SessionService
  ) {
    const platforms = this.platform.platforms();
    if (platforms.includes('ios') || platforms.includes('iphone'))
      this.isIosPlatform = true;

    if (this.isIosPlatform) this.mainContainerMT = 235;

    this.loadCompanies();
  }

  ngOnInit() {
    this.user = this.authenticationService.user;
    this.profile = this.user.profile!;
    this.myUserWatch();
    this.loadMenuByRole()
  }

  private loadMenuByRole(): void {
    const role = this.sessionService.sede;
    const menuMap: Record<UserRole, () => void> = {
      user: () => this.getMenuUser(),
      company_operative: () => this.getMenuCompanyOperative(),
      company_legal: () => this.getMenuCompanyLegal(),
      professional_administrative: () => this.getMenuProfessionalAdministrative(),
      professional_public: () => this.getMenuProfessionalPublic(),
    };
    (menuMap[role] || menuMap['user'])();
  }


  get profileOperative(): any {
    return JSON.parse(localStorage.getItem('appPassaparola_loginSeat')!) || {}
  }

  loadCompanies() {
    this.seatService
      .findAllByUser({
        offset: 1,
        limit: 100,
      })
      .subscribe({
        next: ({ data, metadata }: any) => {
          this.companies = data;
          if (!data.length && this.sessionService.isProfessionalAdministrative) {
            this.navCtrl.navigateForward(['/pages/company/seat']);
          }
        },
      });
  }

  onModify(seat: any) {
    this.navCtrl.navigateForward(['/pages/company/seat/modify', seat.id]);
  }




  getMenuUser() {
    this.menuService.getMenuUser().subscribe({
      next: (response) => (this.menu = response),
    });
  }
  getMenuCompanyLegal() {
    this.menuService.getMenuCompanyLegal().subscribe({
      next: (response) => (this.menu = response),
    });
  }
  getMenuCompanyOperative() {
    this.menuService.getMenuCompanyOperative().subscribe({
      next: (response) => (this.menu = response),
    });
  }
  getMenuProfessionalAdministrative() {
    this.menuService.getMenuProfessionalAdministrative().subscribe({
      next: (response) => (this.menu = response),
    });
  }
  getMenuProfessionalPublic() {
    this.menuService.getMenuProfessionalPublic().subscribe({
      next: (response) => (this.menu = response),
    });
  }














  logout() {
    this.authenticationService.logout();
    this.requestTagsService.clearAllStates();
  }

  async goTo(
    url: string | 'urlBussinesRegister',
    navType: string,
    queryParams: any,
    action?: string
  ) {
    if (action) {
      (this as any)[action]();
      return;
    }

    if (navType === 'modal') {
      switch (url) {
        case 'list-address':
          this.modalListDirecciones();
          break;
        default:
          break;
      }
    }

    if (navType === 'forward') {
      this.navcontroller.navigateForward([url], {
        queryParams: { ...queryParams },
      });
    }

    if (navType === 'root') {
      this.navcontroller.navigateRoot([url], {
        queryParams: { ...queryParams },
      });
    }

    if (navType === 'bussinesReg') {
      const user = localStorage.getItem('appPassaparola_user');
      const userIdEncrypt = this.cryptoService.encrypt(
        JSON.parse(user!).userID
      );
      const url = userIdEncrypt
        ? `${environment.urlBussinesRegister}?promoCode=${userIdEncrypt}`
        : `${environment.urlBussinesRegister}`;
      await Browser.open({ url });
    }
  }

  showAddAccount() {
    this.showAddAccountBtn = !this.showAddAccountBtn;

    if (this.showAddAccountBtn) {
      this.mainContainerMT = 210 + (this.companies.length + 1) * 68;

      if (this.isIosPlatform) this.mainContainerMT = this.mainContainerMT + 25;
    } else {
      this.mainContainerMT = 210;
      if (this.isIosPlatform) this.mainContainerMT = 235;
    }
  }

  closeMenu() {
    this.showAddAccountBtn = false;
    this.mainContainerMT = 210;

    if (this.isIosPlatform) this.mainContainerMT = 235;

    var blob = new Blob(['Hello, world!'], {
      type: 'text/plain;charset=utf-8',
    });
  }

  myUserWatch() {
    this.subscriptionMyUser = this.authenticationService
      .myUserWatch()
      .subscribe((user: User) => {
        if (!user) return;

        if (user.profile?.profilePictureUrlFile) {
          user.profile.profilePictureUrlFile += `?t=${new Date().getTime()}`;
        }

        this.user = user;
        this.profile = this.user.profile!;
        this.cdr.detectChanges();
      });
  }

  async modalQrCode() {
    const walletSelected = JSON.parse(localStorage.getItem('walletSelected')!);
    const modal = await this.modalCtrl.create({
      component: QrCodeComponent,
      backdropDismiss: true,
      componentProps: {
        data: `${walletSelected.userId}-${walletSelected.prog}`,
        wallet: walletSelected,
      },
    });
    await modal.present();
  }

  async goToPageTermsCond() {
    await Browser.open({ url: 'https://passaparola.com/termini-e-condizioni' });
  }

  async goToPageCancelAccount() {
    await Browser.open({ url: 'https://passaparola.com/termini-e-condizioni' });
  }

  async modalListDirecciones() {
    const modal = await this.modalCtrl.create({
      component: ListAddressesComponent,
    });
    await modal.present();
  }

  async changeMultiProfile() {
    const modal = await this.modalCtrl.create({
      component: ModalChangeMultiProfileComponent,
      cssClass: ['radius-modals', 'modal-65vh'],
      breakpoints: [0,1],
      initialBreakpoint: 1
    });
    await modal.present();
  }

}
