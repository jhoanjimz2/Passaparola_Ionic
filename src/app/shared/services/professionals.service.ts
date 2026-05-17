// professionals.service.ts
import { HttpClient, HttpContext, HttpErrorResponse, HttpParams }                          from '@angular/common/http';
import { Injectable }                                                                      from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, tap, throwError }                   from 'rxjs';
import { API_TOKEN }                                                                       from 'src/app/core/interceptors/http.interceptor.service';
import { environment }                                                                     from 'src/environments/environment';
import { LoadProfessionals, Professional, ProfessionalCategory, ProfessionalFilters }      from '../interfaces/professionals/professionals';

export interface Params {
  limit?: number;
  offset?: number;
  keyword?: string;
  languageCode?: string;
  categoryId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfessionalsService {

  private allProfessionalCategory$ = new BehaviorSubject<ProfessionalCategory[]>([]);

  private allProfessionals$ = new BehaviorSubject<Professional[]>([]);
  private professionalsMetadata$ = new BehaviorSubject<any>(null);

  private allProfessionalsWanted$ = new BehaviorSubject<Professional[]>([]);
  private professionalsMetadataWanted$ = new BehaviorSubject<any>(null);

  constructor(
    private http: HttpClient
  ) {}

  allProfessionalCategory(): Observable<ProfessionalCategory[]> {
    return this.allProfessionalCategory$.asObservable();
  }

  allProfessionals(): Observable<Professional[]> {
    return this.allProfessionals$.asObservable();
  }

  professionalsMetadata(): Observable<any> {
    return this.professionalsMetadata$.asObservable();
  }

  allProfessionalsWanted(): Observable<Professional[]> {
    return this.allProfessionalsWanted$.asObservable();
  }

  professionalsMetadataWanted(): Observable<any> {
    return this.professionalsMetadataWanted$.asObservable();
  }

  loadCategoryProfessional(params: Params) {
    let httpParams = new HttpParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        httpParams = httpParams.set(key, value.toString());
      }
    });
    return this.http.get<ProfessionalCategory[]>(
      `${environment.apiKrathemis}/shop-category`,
      {
        params: httpParams,
        context: new HttpContext().set(API_TOKEN, { krathemis: true }),
      }
    )
    .pipe(
      tap((professionalCategory: ProfessionalCategory[]) =>
        this.allProfessionalCategory$.next(professionalCategory || [])
      ),
      catchError((error: HttpErrorResponse) => throwError(() => error))
    );
  }

  loadProfessionals(params: Params) {
    let httpParams = new HttpParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        httpParams = httpParams.set(key, value.toString());
      }
    });
    return this.http.get<LoadProfessionals>(
      `${environment.apiKrathemis}/company/findAll/professionals`,
      {
        params: httpParams,
        context: new HttpContext().set(API_TOKEN, { krathemis: true }),
      }
    )
    .pipe(
      tap((response: LoadProfessionals) => {
        this.allProfessionals$.next(response.data || []);
        this.professionalsMetadata$.next(response.metadata || null);
      }),
      catchError((error: HttpErrorResponse) => throwError(() => error))
    );
  }

  loadProfessionalsWanted(params: Params) {
    let httpParams = new HttpParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        httpParams = httpParams.set(key, value.toString());
      }
    });
    return this.http.get<LoadProfessionals>(
      `${environment.apiKrathemis}/company/findAll/professionals`,
      {
        params: httpParams,
        context: new HttpContext().set(API_TOKEN, { krathemis: true }),
      }
    )
    .pipe(
      tap((response: LoadProfessionals) => {
        this.allProfessionalsWanted$.next(response.data || []);
        this.professionalsMetadataWanted$.next(response.metadata || null);
      }),
      catchError((error: HttpErrorResponse) => throwError(() => error))
    );
  }


  findAllSuggestions(params: Params) {
    let httpParams = new HttpParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        httpParams = httpParams.set(key, value.toString());
      }
    });
    return this.http.get<any>(
        `${environment.apiKrathemis}/social-community/category/find-all/main-and-sub`,
        {
          params: httpParams,
          context: new HttpContext().set(API_TOKEN, { krathemis: true, showSpinner: false }),
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
