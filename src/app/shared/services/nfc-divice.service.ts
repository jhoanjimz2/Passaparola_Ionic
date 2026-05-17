import {
  HttpClient,
  HttpContext,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { catchError, map, throwError } from 'rxjs';

import { environment } from 'src/environments/environment';
import { API_TOKEN } from 'src/app/core/interceptors/http.interceptor.service';
import { NfcDivice } from '../interfaces/passaparolaCard/nfc-divice.interface';

@Injectable({
  providedIn: 'root',
})
export class NfcDiviceService {
  constructor(private http: HttpClient) {}

  createNfc(nfc: NfcDivice) {
    return this.http
      .post<NfcDivice>(`${environment.apiUnika}/passaparola-card/nfc`, nfc, {
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

  findAllByuser() {
    return this.http
      .get<NfcDivice[]>(
        `${environment.apiUnika}/passaparola-card/nfc/find-all-by-user`,
        {
          context: new HttpContext().set(API_TOKEN, { krathemis: true }),
          params: {
            limit: 10000,
            offset: 0,
            languageCode: localStorage.getItem('language')
              ? localStorage.getItem('language')!
              : 'it',
          },
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
