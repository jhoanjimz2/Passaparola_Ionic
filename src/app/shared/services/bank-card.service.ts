import {
  HttpClient,
  HttpContext,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, map, catchError, throwError } from 'rxjs';

import { API_TOKEN } from 'src/app/core/interceptors/http.interceptor.service';
import { environment } from 'src/environments/environment';

import {
  IBankCard,
  IResponseBankCard,
} from '../interfaces/bank-card/bank-card.interface';

@Injectable({
  providedIn: 'root',
})
export class BankCardService {
  constructor(private http: HttpClient) {}

  create(bankCard: IBankCard): Observable<IBankCard> {
    return this.http
      .post<IBankCard>(`${environment.apiKrathemis}/bank-card`, bankCard, {
        context: new HttpContext().set(API_TOKEN, { krathemis: true }),
      })
      .pipe(
        map((response: IBankCard) => {
          return response;
        })
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  findAll({ filterUser, offset, limit }: any): Observable<IResponseBankCard> {
    return this.http
      .get<IResponseBankCard>(
        `${environment.apiKrathemis}/bank-card/find-all/${filterUser}?offset=${offset}&limit=${limit}`,
        {
          context: new HttpContext().set(API_TOKEN, { krathemis: true }),
        }
      )
      .pipe(
        map((response: IResponseBankCard) => {
          return response;
        })
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  delete(id: string): Observable<any> {
    return this.http
      .delete<any>(`${environment.apiKrathemis}/bank-card/${id}/true`, {
        context: new HttpContext().set(API_TOKEN, { krathemis: true }),
      })
      .pipe(
        map((response: any) => {
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
