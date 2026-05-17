import { Injectable }             from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
  HttpContextToken,
} from '@angular/common/http';
import { ModalController }        from '@ionic/angular';

import { Observable, throwError } from 'rxjs';
import { catchError, finalize }   from 'rxjs/operators';
import { NgxSpinnerService }      from 'ngx-spinner';
import { ToastrService }          from 'ngx-toastr';
import { TranslateService }       from '@ngx-translate/core';

import { ApiToken }               from '../../shared/interfaces/general/api-token.interface';
import { AuthenticationService }  from '../service/authentication.service';

const apiToken: ApiToken = {
  krathemis: false,
  krathemisBasic: false,
  applicationJson: false,
  showSpinner: true
};

export const API_TOKEN = new HttpContextToken<ApiToken>(() => apiToken);

@Injectable({
  providedIn: 'root',
})
export class HttpInterceptorService implements HttpInterceptor {
  private activeRequests = 0;

  constructor(
    private authenticationService: AuthenticationService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private modalController: ModalController
  ) {}


  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const apiContext = req.context.get(API_TOKEN);

    const shouldShowSpinner = apiContext.showSpinner !== false;

    if (shouldShowSpinner) {
      this.activeRequests++;
      this.spinner.show();
    }

    let reqClone = req;
    let authorization: string = '';

    // Si la petición debe saltar autenticación, no agregamos headers
    if (apiContext.skipAuth) {
      return next.handle(reqClone).pipe(
        catchError((error) => this.handleError(error)),
        finalize(() => {
          if (shouldShowSpinner) {
            this.activeRequests--;
            if (this.activeRequests === 0) {
              this.spinner.hide();
            }
          }
        })
      );
    }
    if (apiContext.isPublic) {
      const publicToken: string = localStorage.getItem('appPassaparola_publicToken')!;
      if (publicToken) {
        authorization = 'Bearer ' + publicToken;
      }
    } else {
      const token: string = localStorage.getItem('appPassaparola_userToken')!;
      const basicToken: string = localStorage.getItem('appPassaparola_basicToken')!;

      if ((apiContext.krathemis || apiContext.apiGateway) && token) {
        authorization = 'Bearer ' + token;
      }

      if (apiContext.krathemisBasic && basicToken) {
        authorization = 'Bearer ' + basicToken;
      }
    }
    if ((apiContext.krathemis || apiContext.krathemisBasic || apiContext.isPublic) && authorization) {
      reqClone = req.clone({
        headers: req.headers.set('Authorization', authorization),
      });
    }

    if (apiContext.apiGateway) {
      const user = localStorage.getItem('appPassaparola_user');
      reqClone = req.clone({
        headers: reqClone.headers.set('X-Uid', JSON.parse(user!).id),
      });
    }

    return next.handle(reqClone).pipe(
      catchError((error) => this.handleError(error)),
      finalize(() => {
        if (shouldShowSpinner) {
          this.activeRequests--;
          if (this.activeRequests === 0) {
            this.spinner.hide();
          }
        }
      })
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let message: string = '';
    let i = 0;

    if (error.error) {
      if (typeof error.error.message === 'object') {
        error.error.message.forEach((ms: string) => {
          message +=
            i === error.error.message.length - 1 ? `${ms}.` : `${ms}, `;
          i++;
        });
      }
      if (error.error.message) message = error.error.message;
    }

    if (error.status === 401) {
      this.toastr.error(this.translate.instant('GENERAL.SESSION_EXPIRED'));
      this.modalController.dismiss();
      this.authenticationService.logout();
    } else if (error.status >= 400 && error.status <= 499) {
      this.toastr.error(message, 'Error');
    } else {
      this.toastr.error(
        message ? message : this.translate.instant('GENERAL.SERVER_ERROR')
      );
    }

    return throwError(() => error);
  }
}
