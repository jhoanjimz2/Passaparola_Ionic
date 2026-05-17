import {
  HttpClient,
  HttpContext,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, throwError } from 'rxjs';

import { environment } from 'src/environments/environment';
import { RechargeInGateway } from '../interfaces/gateway/requets/recharge.interface';
import { API_TOKEN } from 'src/app/core/interceptors/http.interceptor.service';

@Injectable({
  providedIn: 'root',
})
export class GatewayService {
  constructor(private http: HttpClient) {}

  recharge(requets: RechargeInGateway) {
    return this.http
      .post<any>(
        `${environment.apiGateway}/wallet-recharge`,
        { requets },
        {
          context: new HttpContext().set(API_TOKEN, { apiGateway: true }),
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
}
