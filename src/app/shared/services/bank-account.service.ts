import {
  HttpClient,
  HttpContext,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, catchError, throwError, Observable } from 'rxjs';

import { API_TOKEN } from 'src/app/core/interceptors/http.interceptor.service';

import { environment } from 'src/environments/environment';
import {
  IBankAccount,
  IResponseBankAccount,
} from '../interfaces/bank-account/bank-account.interface';

@Injectable({
  providedIn: 'root',
})
export class BankAccountService {
  constructor(private http: HttpClient) {}

  create(bankAccount: IBankAccount): Observable<IBankAccount> {
    return this.http
      .post<IBankAccount>(
        `${environment.apiKrathemis}/bank-account`,
        bankAccount,
        {
          context: new HttpContext().set(API_TOKEN, { krathemis: true }),
        }
      )
      .pipe(
        map((response: IBankAccount) => {
          return response;
        })
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  findAll({
    filterUser,
    offset,
    limit,
  }: any): Observable<IResponseBankAccount> {
    return this.http
      .get<IResponseBankAccount>(
        `${environment.apiKrathemis}/bank-account/find-all/${filterUser}?offset=${offset}&limit=${limit}`,
        {
          context: new HttpContext().set(API_TOKEN, { krathemis: true }),
        }
      )
      .pipe(
        map((response: IResponseBankAccount) => {
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
      .delete<any>(`${environment.apiKrathemis}/bank-account/${id}/true`, {
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

  favorite(id: string): Observable<any> {
    return this.http
      .patch<any>(
        `${environment.apiKrathemis}/bank-account/favorite/${id}/true`,
        {},
        {
          context: new HttpContext().set(API_TOKEN, { krathemis: true }),
        }
      )
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
