import {
  HttpClient,
  HttpContext,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable }                                               from '@angular/core';

import { BehaviorSubject, catchError, map, Observable, throwError } from 'rxjs';

import { environment }                                              from 'src/environments/environment';
import { API_TOKEN }                                                from 'src/app/core/interceptors/http.interceptor.service';
import { SmsSendCodeResponse }                                      from '../interfaces/sms-code/response/sms-send-code-response.interface';
import { SmsSendCodeRequest }                                       from '../interfaces/sms-code/request/sms-send-code-request.interface';
import { PlatformService }                                          from './platform.service';

declare var cordova: any;

// TOjcZL9all+
// business HuvWkZN+Iwv

@Injectable({
  providedIn: 'root',
})
export class SmsCodeService {
  private smsCode: BehaviorSubject<string | null> = new BehaviorSubject<
    string | null
  >(null);

  constructor(
    private http: HttpClient,
    private platformService: PlatformService
  ) {}

  sendSms(smsSendCodeRequest: SmsSendCodeRequest) {
    return this.http
      .post<SmsSendCodeResponse>(
        `${environment.apiKrathemis}/sms-code`,
        { ...smsSendCodeRequest, hash: 'TOjcZL9all+' },
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

  checkCode(code: string, idResponse: string) {
    return this.http
      .get<SmsSendCodeResponse>(
        `${environment.apiKrathemis}/sms-code/check/${code}/${idResponse}`,
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

  getAppHash() {
    cordova.plugins.smsRetriever.getAppHash(
      (hash: string) => {
      },
      (err: any) => {
        console.error('Error getting hash:', err);
      }
    );
  }

  startSMSListener() {
    if (this.platformService.isAndroid()) {
      cordova.plugins.smsRetriever.startWatching(
        (sms: any) => {
          const otp = this.extractOtpFromMessage(sms.Message);
          this.smsCodeSet(otp);
          this.startSMSListener();
        },
        (error: any) => {
          console.error('error watching SMS:', error);
        }
      );
    }
  }

  extractOtpFromMessage(sms: string): string {
    const match = sms.match(/\b\d{4,8}\b/);
    return match ? match[0] : '';
  }

  smsCodeWatch(): Observable<string | null> {
    return this.smsCode.asObservable();
  }

  smsCodeSet(value: string | null) {
    this.smsCode.next(value);
  }
}
