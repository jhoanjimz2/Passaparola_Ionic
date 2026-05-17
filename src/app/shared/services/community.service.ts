import {
  HttpClient,
  HttpContext,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { catchError, map, throwError } from 'rxjs';

import { environment } from 'src/environments/environment';
import { API_TOKEN } from 'src/app/core/interceptors/http.interceptor.service';
import { Community } from '../interfaces/community/community.interface';
import { SummaryCommunity } from '../interfaces/community/summary-friends.interface';

@Injectable({
  providedIn: 'root',
})
export class CommunityService {
  constructor(private http: HttpClient) {}

  createCommunity(community: Community) {
    return this.http
      .post<Community>(`${environment.apiUnika}/community`, community, {
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

  // getSummaryCommunity(
  //   userId: string,
  //   countryCode: string,
  //   month: number,
  //   year: number
  // ) {
  //   return this.http
  //     .get<SummaryCommunity>(
  //       `${environment.apiUnika}/community/summary-community/${userId}/${countryCode}/${month}/${year}`,
  //       {
  //         context: new HttpContext().set(API_TOKEN, { krathemisBasic: true }),
  //       }
  //     )
  //     .pipe(
  //       map((response) => {
  //         return response;
  //       })
  //     )
  //     .pipe(
  //       catchError((error: HttpErrorResponse) => {
  //         return throwError(() => error);
  //       })
  //     );
  // }

  getSummaryCommunityByUserIds(
    userId: string[],
    countryCode: string,
    month: number,
    year: number
  ) {
    return this.http
      .post<SummaryCommunity[]>(
        `${environment.apiUnika}/community/summary-community-by-userIds/${countryCode}/${month}/${year}`,
        userId,
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

  findSummaryCommunityByCountry(userId: string, month: number, year: number) {
    return this.http
      .get<SummaryCommunity[]>(
        `${environment.apiUnika}/community/summary-community-by-country/${userId}/${month}/${year}`,
        {
          context: new HttpContext().set(API_TOKEN, { krathemis: true }),
          params: {
            limit: 100,
            offset: 0,
            keyword: '',
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
