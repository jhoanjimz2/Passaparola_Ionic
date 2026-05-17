import {
  HttpClient,
  HttpContext,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';

import { BehaviorSubject, Observable, catchError, map, throwError } from 'rxjs';
// import { FirebaseAuthentication } from '@capacitor-firebase/authentication';

import { User } from 'src/app/shared/interfaces/user/user.interface';
import { environment } from 'src/environments/environment';
import { API_TOKEN } from '../interceptors/http.interceptor.service';
import { LoginRequets } from 'src/app/shared/interfaces/user/requets/login-requets.interface';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { Company } from 'src/app/shared/interfaces/company/company.interface';
import { WebsocketService } from 'src/app/shared/services';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  user: User | Company | any;
  userToken: string = '';
  basicToken: string = '';
  private myUser: BehaviorSubject<any>;

  constructor(
    private http: HttpClient,
    private navController: NavController,
    private toastr: ToastrService,
    private translate: TranslateService,
    private modalController: ModalController,
    private websocketService: WebsocketService,
    private spinner: NgxSpinnerService
  ) {
    this.loadStorage();
    this.myUser = new BehaviorSubject(false);
  }

  login(data: LoginRequets) {
    return this.http
      .post<User>(`${environment.apiKrathemis}/auth/login`, data, {})
      .pipe(
        map((response) => {
          this.userToken = response.token!;
          this.user = response;
          localStorage.setItem('appPassaparola_userToken', this.userToken);
          localStorage.setItem(
            'appPassaparola_user',
            JSON.stringify(this.user)
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

  loginCompany(data: LoginRequets) {
    return this.http
      .post<Company>(`${environment.apiKrathemis}/auth/company-login`, data, {})
      .pipe(
        map((response) => {
          this.userToken = response.token!;
          this.user = response;
          localStorage.setItem('appPassaparola_userToken', this.userToken);
          localStorage.setItem(
            'appPassaparola_user',
            JSON.stringify(this.user)
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

  loginSeat(data: LoginRequets) {
    return this.http
      .post<Company>(`${environment.apiKrathemis}/auth/seat-login`, data, {})
      .pipe(
        map((response) => {
          this.userToken = response.token!;
          this.user = response;
          localStorage.setItem('appPassaparola_userToken', this.userToken);
          localStorage.setItem(
            'appPassaparola_user',
            JSON.stringify(this.user)
          );
          localStorage.setItem(
            'appPassaparola_loginSeat',
            JSON.stringify(response.seat)
          );
          localStorage.setItem('appPassaparola_isLoginSeat', 'true');
          return response;
        })
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  basicAuth() {
    return this.http
      .post(`${environment.apiKrathemis}/auth/authentication`, {})
      .pipe(
        map((response: any) => {
          this.basicToken = response.token!;
          localStorage.setItem('appPassaparola_basicToken', this.basicToken);
          return response;
        })
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  checkLogin(data: LoginRequets) {
    return this.http
      .post<User>(`${environment.apiKrathemis}/auth/login`, data, {
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

  checkLoginCompany(data: LoginRequets) {
    return this.http
      .post<User>(`${environment.apiKrathemis}/auth/company-login`, data, {
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

  checkPhone(prefix: string, phone: string) {
    return this.http
      .get<any>(
        `${environment.apiKrathemis}/auth/check-phone/${prefix}/${phone}`,
        {
          // context: new HttpContext().set(API_TOKEN, { krathemisBasic: true }),
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

  renewTokenPassaparola() {
    return this.http
      .post<User>(
        `${environment.apiKrathemis}/auth/renew-token`,
        {},
        {
          context: new HttpContext().set(API_TOKEN, { krathemis: true }),
        }
      )
      .pipe(
        map((response) => {
          this.userToken = response.token!;
          localStorage.setItem('appPassaparola_userToken', this.userToken);
          return response;
        })
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  loadStorage() {
    const user = localStorage.getItem('appPassaparola_user');
    const userToken = localStorage.getItem('appPassaparola_userToken');
    this.user = user ? JSON.parse(user) : ({} as User);
    this.userToken = userToken ? userToken : '';
  }

  removeStorage() {
    localStorage.removeItem('appPassaparola_userToken');
  }

  isLoged() {
    return localStorage.getItem('appPassaparola_userToken') ? true : false;
  }

  async logout() {
    this.spinner.show();
    try {
      let modal = await this.modalController.getTop();
      while (modal) {
        if (modal.id !== 'modalSplashScreen') {
          await this.modalController.dismiss();
        } else {
          break;
        }
        modal = await this.modalController.getTop();
      }
    } catch (error) {
      console.error('Error closing modals:', error);
    }
    localStorage.removeItem('appPassaparola_userToken');
    localStorage.removeItem('appPassaparola_walletToken');
    localStorage.removeItem('appPassaparola_loginSeat');
    localStorage.removeItem('appPassaparola_isLoginSeat');
    localStorage.removeItem('walletSelected');
    this.navController.navigateBack(['login']);
    this.websocketService.disconnect();
    this.spinner.hide();
  }

  myUserWatch(): Observable<any> {
    return this.myUser.asObservable();
  }

  myUserSet(value: User) {
    this.user = { ...this.user, ...value };
    localStorage.setItem('appPassaparola_user', JSON.stringify(this.user));
    this.myUser.next(value);
  }

  checkTokenLogin() {
    const token = localStorage.getItem('appPassaparola_userToken');
    return this.checkToken(token!);
  }

  checkTokenWallet() {
    const token = localStorage.getItem('appPassaparola_walletBasicToken');
    return this.checkToken(token!);
  }

  checkToken(token: string) {
    if (!token) {
      this.logout();
      return false;
    }
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expired = this.veryfyTokenExp(payload.exp);
    if (expired) {
      this.logout();
      setTimeout(() => {
        // this.toastr.error(this.translate.instant('GENERAL.SESSION_EXPIRED'));
      }, 500);
      return false;
    }
    return true;
  }

  veryfyTokenExp(dateTokenExp: number) {
    const timeNow = new Date().getTime() / 1000;
    if (dateTokenExp < timeNow) {
      return true;
    } else {
      return false;
    }
  }
}
