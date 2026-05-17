import { HttpClient, HttpContext, HttpErrorResponse, HttpParams }   from '@angular/common/http';
import { Injectable }                                               from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { API_TOKEN }                                                from 'src/app/core/interceptors/http.interceptor.service';
import { environment }                                              from 'src/environments/environment';
import { Contract, ContractListParams, ContractListResponse }       from '../interfaces/contract/contract.interface';

export interface ContractSignPayload {
  type:              string;
  status:            'pending' | 'signed' | 'approved' | 'rejected';
  documentUrl:       string;
  expirationDate:    string | null;
  frontDocumentUrl:  string;
  backDocumentUrl:   string;
  selfieUrl:         string;
  user: {
    id: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ContractService {

  private contracts$ = new BehaviorSubject<Contract[]>([]);

  constructor(private http: HttpClient) {}

  contracts(): Observable<Contract[]> {
    return this.contracts$.asObservable();
  }

  getAll(params: ContractListParams = {}): Observable<ContractListResponse> {
    let httpParams = new HttpParams();
    if (params.limit !== undefined)        httpParams = httpParams.set('limit', params.limit);
    if (params.offset !== undefined)       httpParams = httpParams.set('offset', params.offset);
    if (params.keyword !== undefined)      httpParams = httpParams.set('keyword', params.keyword);
    if (params.languageCode !== undefined) httpParams = httpParams.set('languageCode', params.languageCode);

    return this.http.get<ContractListResponse>(
      `${environment.apiKrathemis}/contract/verifications/by-user`,
      {
        params: httpParams,
        context: new HttpContext().set(API_TOKEN, { krathemis: true }),
      }
    )
    .pipe(tap((res: ContractListResponse) => this.contracts$.next(res.data)))
    .pipe(catchError((error: HttpErrorResponse) => throwError(() => error)));
  }

  getById(id: string): Observable<Contract> {
    return this.http.get<Contract>(
      `${environment.apiKrathemis}/contract/verification/${id}`,
      {
        context: new HttpContext().set(API_TOKEN, { krathemis: true }),
      }
    )
    .pipe(catchError((error: HttpErrorResponse) => throwError(() => error)));
  }

  sign(id: string, payload: ContractSignPayload): Observable<Contract> {
    return this.http.patch<Contract>(
      `${environment.apiKrathemis}/contract/verification/${id}/sign`,
      payload,
      {
        context: new HttpContext().set(API_TOKEN, { krathemis: true }),
      }
    )
    .pipe(catchError((error: HttpErrorResponse) => throwError(() => error)));
  }
}
