import {
  HttpClient,
  HttpContext,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable }                              from '@angular/core';

import { map, catchError, throwError, Observable } from 'rxjs';

import { API_TOKEN }                               from 'src/app/core/interceptors/http.interceptor.service';
import { environment }                             from 'src/environments/environment';
import { CompanySeat }                             from '../interfaces/company/company-seat.interface';
import { CacheService }                            from './cache.service';

@Injectable({
  providedIn: 'root',
})
export class SeatService {
  constructor(
    private http: HttpClient,
    private cacheService: CacheService
  ) {}

  getType(): Observable<any> {
    const languageCode = localStorage.getItem('language')
      ? localStorage.getItem('language')!
      : 'it';
    return this.http
      .get<any>(
        `${environment.apiKrathemis}/company-profile/seat/find-all/type?languageCode=${languageCode}`,
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

  getClientType(): Observable<any> {
    const languageCode = localStorage.getItem('language')
      ? localStorage.getItem('language')!
      : 'it';
    return this.http
      .get<any>(
        `${environment.apiKrathemis}/company-profile/seat/find-all/client-type?languageCode=${languageCode}`,
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

  create(payload: any) {
    return this.http
      .post<any>(`${environment.apiKrathemis}/company-profile/seat`, payload, {
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

  findAll({
    offset,
    limit,
    categoryIds,
    keyword,
    type = 'all',
    isSuggested = false,
  }: any): Observable<any> {
    return this.http
      .post<CompanySeat[]>(
        `${environment.apiKrathemis}/company-profile/seat/find/all`,
        categoryIds,
        {
          context: new HttpContext().set(API_TOKEN, { krathemis: true }),
          params: { offset, limit, keyword, type, isSuggested },
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

  findAllByUser({ offset, limit }: any): Observable<any> {
    const cacheKey = `seat:by-user:${offset}:${limit}`;
    return this.cacheService.wrap(
      cacheKey,
      this.http.get<any>(
        `${environment.apiKrathemis}/company-profile/seat/find/by-user?offset=${offset}&limit=${limit}`,
        {
          context: new HttpContext().set(API_TOKEN, { krathemis: true }),
        }
      ).pipe(
        catchError((error: HttpErrorResponse) => throwError(() => error))
      )
    );
  }

  findOne(id: any): Observable<any> {
    return this.http
      .get<any>(`${environment.apiKrathemis}/company-profile/seat/${id}`, {
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

  update(id: string, payload: any) {
    delete payload.walletId;
    return this.http
      .patch<any>(
        `${environment.apiKrathemis}/company-profile/seat/${id}/${
          localStorage.getItem('language')
            ? localStorage.getItem('language')!
            : 'it'
        }`,
        payload,
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

  findAllTags(): Observable<any> {
    const languageCode = localStorage.getItem('language')
      ? localStorage.getItem('language')!
      : 'it';
    return this.http
      .get<any>(
        `${environment.apiKrathemis}/company-profile/seat/find-all/tags?offset=0&limit=100000000&languageCode=${languageCode}`,
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

  createBoard(payload: any) {
    return this.http
      .post<any>(
        `${environment.apiKrathemis}/company-profile/seat/board`,
        payload,
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

  findAllBoards(seatId: string): Observable<any> {
    return this.cacheService.wrap(
      `boards:${seatId}`,
      this.http.get<any>(
        `${environment.apiKrathemis}/company-profile/seat/board/${seatId}`,
        {
          context: new HttpContext().set(API_TOKEN, { krathemis: true }),
        }
      ).pipe(
        catchError((error: HttpErrorResponse) => throwError(() => error))
      )
    );
  }

  findAllBoardsPublic(seatId: string): Observable<any> {
    return this.cacheService.wrap(
      `boards:${seatId}:public`,
      this.http.get<any>(
        `${environment.apiKrathemis}/company-profile/seat/board/${seatId}`,
        {
          context: new HttpContext().set(API_TOKEN, { krathemis: true, isPublic: true }),
        }
      ).pipe(
        catchError((error: HttpErrorResponse) => throwError(() => error))
      )
    );
  }

  findAllScheduleDays(): Observable<any> {
    const languageCode = localStorage.getItem('language')
      ? localStorage.getItem('language')!
      : 'it';
    return this.http
      .get<any>(
        `${environment.apiKrathemis}/company-profile/seat/find-all/schedule-day?languageCode=${languageCode}`,
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

  findAllTopPR(limit: string, offset: string, keyword: string) {
    return this.http
      .get<any>(
        `${environment.apiKrathemis}/company-profile/seat/find/all/top-pr?limit=${limit}&offset=${offset}&keyword=${keyword}`,
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

  findOneSuggested(id: any): Observable<any> {
    return this.http
      .get<any>(
        `${environment.apiKrathemis}/company-profile/seat-suggested/${id}`,
        {
          context: new HttpContext().set(API_TOKEN, { krathemisBasic: true }),
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

  findOneByWalletId(walletId: string): Observable<any> {
    return this.http
      .get<CompanySeat>(
        `${environment.apiKrathemis}/company-profile/seat-by-walletId/${walletId}`,
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
}
