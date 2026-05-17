import {
  HttpClient,
  HttpContext,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable }                  from '@angular/core';

import { catchError, map, throwError } from 'rxjs';
import { TranslateService }            from '@ngx-translate/core';
import { ToastrService }               from 'ngx-toastr';

import { environment }                 from 'src/environments/environment';
import { API_TOKEN }                   from 'src/app/core/interceptors/http.interceptor.service';
import { User }                        from '../interfaces/user/user.interface';
import { Profile }                     from '../interfaces/user/profile.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {}

  createUser(user: User) {
    user = { ...user, appName: 'passaparola' };
    return this.http
      .post<User>(`${environment.apiKrathemis}/user`, user, {
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

  updateUser(user: User) {
    const id = user.id;
    delete user.id;
    return this.http
      .patch<User>(`${environment.apiKrathemis}/user/${id}`, user, {
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

  activateUser(user: User) {
    const id = user.id;
    delete user.id;
    return this.http
      .patch<User>(
        `${environment.apiKrathemis}/user/activate-user/${id}`,
        user,
        {
          context: new HttpContext().set(API_TOKEN, { krathemisBasic: true }),
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

  getUserByPhone(prefix: string, phone: string) {
    return this.http
      .get<User>(
        `${environment.apiKrathemis}/user/find-by-phone/${prefix}/${phone}`,
        {
          context: new HttpContext().set(API_TOKEN, { krathemisBasic: true }),
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

  getUserById(id: string) {
    return this.http
      .get<User>(`${environment.apiKrathemis}/user/${id}`, {
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

  updateProfile(profile: Profile) {
    const id = profile.id;
    delete profile.id;
    return this.http
      .patch<any>(`${environment.apiKrathemis}/profile/${id}`, profile, {
        context: new HttpContext().set(API_TOKEN, { krathemis: true }),
      })
      .pipe(
        map((response) => {
          this.toastr.success(
            this.translate.instant('IDENTITY.PROFILE_UPDATED')
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

  getProfileById(id: string) {
    return this.http
      .get<Profile>(`${environment.apiKrathemis}/profile/${id}`, {
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

  getUsersByPhone(phones: string[]) {
    return this.http
      .post<User[]>(`${environment.apiKrathemis}/user/users-by-phone`, phones, {
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

  getUserByUserID(userID: string) {
    return this.http
      .get<User>(`${environment.apiKrathemis}/user/find-by-userID/${userID}`, {
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

  checkPin(pin: string) {
    return this.http
      .post<User>(
        `${environment.apiKrathemis}/user/check/pin`,
        { pin },
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

  checkPinCompany(pin: string) {
    return this.http
      .post<User>(
        `${environment.apiKrathemis}/company/check/pin`,
        { pin },
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

  checkPromoCode(userID: string) {
    return this.http
      .get<User>(
        `${environment.apiKrathemis}/user/check-promo-code/${userID}`,
        {
          context: new HttpContext().set(API_TOKEN, { krathemisBasic: true }),
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

  getUsers(userIds: string[]) {
    return this.http
      .post<User[]>(
        `${environment.apiKrathemis}/user/users-by-userIds`,
        userIds,
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

  updateUserPin(user: User) {
    const id = user.id;
    delete user.id;
    return this.http
      .patch<User>(`${environment.apiKrathemis}/user/pin/${id}`, user, {
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
}
