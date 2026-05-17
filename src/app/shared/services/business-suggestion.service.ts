import {
  HttpClient,
  HttpContext,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { map, catchError, throwError } from 'rxjs';

import { API_TOKEN } from 'src/app/core/interceptors/http.interceptor.service';
import { environment } from 'src/environments/environment';
import {
  IBusinessSuggestion,
  IResponseBusinessSuggestion,
} from '../interfaces/business-suggestion/business-suggestion.interface';
import { BusinessSuggestionVote } from '../interfaces/business-suggestion/business-suggestion-vte.interface';

@Injectable({
  providedIn: 'root',
})
export class BusinessSuggestionService {
  constructor(private http: HttpClient) {}

  create(businessSuggestion: IBusinessSuggestion) {
    return this.http
      .post<IBusinessSuggestion>(
        `${environment.apiKrathemis}/business-suggestion`,
        businessSuggestion,
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

  findAll({ status, filterUser, offset, limit }: any) {
    return this.http
      .get<IResponseBusinessSuggestion>(
        `${environment.apiKrathemis}/business-suggestion/find-all/${status}/${filterUser}?offset=${offset}&limit=${limit}`,
        {
          context: new HttpContext().set(API_TOKEN, { krathemis: true }),
        }
      )
      .pipe(
        map((response: IResponseBusinessSuggestion) => {
          return response;
        })
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  vote(businessSuggestionVote: BusinessSuggestionVote) {
    return this.http
      .post<BusinessSuggestionVote>(
        `${environment.apiKrathemis}/business-suggestion/vote`,
        businessSuggestionVote,
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

  findAllVotes({ offset, limit, id, filterUser }: any) {
    return this.http
      .get<BusinessSuggestionVote[]>(
        `${environment.apiKrathemis}/business-suggestion/votes/find-all-by-business-suggestion/${id}/${filterUser}`,
        {
          context: new HttpContext().set(API_TOKEN, { krathemis: true }),
          params: {
            limit,
            offset,
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
