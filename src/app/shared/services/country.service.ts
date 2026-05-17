import {
  HttpClient,
  HttpContext,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { catchError, map, throwError } from 'rxjs';

import { environment } from 'src/environments/environment';
import { API_TOKEN } from 'src/app/core/interceptors/http.interceptor.service';
import { Country } from '../interfaces/country/country.interface';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  constructor(private http: HttpClient) {}

  findAll() {
    return this.http
      .get<Country[]>(`${environment.apiKrathemis}/country`, {
        context: new HttpContext().set(API_TOKEN, { krathemisBasic: true }),
        params: {
          limit: 100,
          offset: 0,
          keyword: '',
          languageCode: localStorage.getItem('language')
            ? localStorage.getItem('language')!
            : 'it',
        },
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
