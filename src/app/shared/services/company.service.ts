import {
  HttpClient,
  HttpContext,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { catchError, map, throwError } from 'rxjs';

import { environment } from 'src/environments/environment';
import { API_TOKEN } from 'src/app/core/interceptors/http.interceptor.service';
import { Company } from '../interfaces/company/company.interface';
import { CompanyType } from '../interfaces/company/company-type.interface';
import { ProfileCompany } from '../interfaces/company/profile-company.interface';
import { CompanySeat } from '../interfaces/company/company-seat.interface';
import { CompanyLegalType } from '../interfaces/company/company-legal-type.interface';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {}

  getCompanyById(id: string) {
    return this.http
      .get<Company>(`${environment.apiKrathemis}/company/${id}`, {
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

  getCompanyByUserId(userId: string) {
    return this.http
      .get<Company>(
        `${environment.apiKrathemis}/company/find-by-userID/${userId}`,
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

  getCompanyTypes() {
    return this.http
      .get<CompanyType[]>(
        `${environment.apiKrathemis}/company/find-all/company-types`,
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

  getCompanyProfile(id: string) {
    return this.http
      .get<ProfileCompany>(
        `${environment.apiKrathemis}/company-profile/${id}`,
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

  updateCompany(company: Company) {
    const id = company.id;
    delete company.id;
    return this.http
      .patch<Company>(`${environment.apiKrathemis}/company/${id}`, company, {
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

  updateCompanyProfile(profile: ProfileCompany) {
    const id = profile.id;
    delete profile.id;
    return this.http
      .patch<ProfileCompany>(
        `${environment.apiKrathemis}/company-profile/${id}`,
        profile,
        {
          context: new HttpContext().set(API_TOKEN, { krathemis: true }),
        }
      )
      .pipe(
        map((response) => {
          this.toastr.success(
            this.translate.instant('IDENTITY.PROFILE_UPDATED')
          );
          return response;
        })
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  checkPinSeat(pin: string, id: string) {
    return this.http
      .post<CompanySeat>(
        `${environment.apiKrathemis}/company-profile/seat/check-pin`,
        { pin, id },
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

  getCompanyLegalTypes() {
    return this.http
      .get<CompanyLegalType[]>(
        `${environment.apiKrathemis}/company/find-all/company-legal-types`,
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

  updatePin(company: Company) {
    const id = company.id;
    delete company.id;
    return this.http
      .patch<Company>(
        `${environment.apiKrathemis}/company/pin/${id}`,
        company,
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
}
