import {
  HttpClient,
  HttpContext,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, throwError } from 'rxjs';

import { API_TOKEN } from 'src/app/core/interceptors/http.interceptor.service';

import { environment } from 'src/environments/environment';
import { ICategory } from '../interfaces/company/category.interface';
import { CategoriesResponse } from '../interfaces/company/response/categories-response.interface';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private http: HttpClient) {}

  getAll(limit: number, offset: number) {
    return this.http
      .get<CategoriesResponse>(`${environment.apiKrathemis}/company-category`, {
        context: new HttpContext().set(API_TOKEN, { krathemisBasic: true }),
        params: {
          limit,
          offset,
          languageCode: localStorage.getItem('language')
            ? localStorage.getItem('language')!
            : 'it',
        },
      })
      .pipe(
        map((response) => {
          return response.data.filter(
            (item) => item.companyCategoryTranslation.length > 0
          );
        })
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  getAllWithChildren() {
    return this.http
      .get<ICategory[]>(
        `${environment.apiKrathemis}/company-category/find-all/with-children`,
        {
          context: new HttpContext().set(API_TOKEN, { krathemis: true }),
          params: {
            limit: 1000,
            offset: 0,
            keyword: '',
            languageCode: localStorage.getItem('language')
              ? localStorage.getItem('language')!
              : 'it',
          },
        }
      )
      .pipe(
        map((response: ICategory[]) => {
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
