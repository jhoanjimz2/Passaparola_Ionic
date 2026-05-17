import { HttpClient, HttpContext, HttpErrorResponse } from '@angular/common/http';
import { Injectable }                                 from '@angular/core';
import { environment }                                from 'src/environments/environment';
import { Contract }                                   from '../interfaces/contract/contract';
import { catchError, map, throwError }                from 'rxjs';
import { API_TOKEN }                                  from 'src/app/core/interceptors/http.interceptor.service';
import { Analysis }                                   from '../interfaces/contract/review';

@Injectable({
  providedIn: 'root'
})
export class HomeGardenService {

  constructor(private http: HttpClient) {}

  request(contract: Contract) {
    return this.http
      .post<any>(
        `${environment.apiKrathemis}/contract/request`,
        contract,
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

  analysis(analysis: Analysis) {
    return this.http
      .post<any>(
        `${environment.apiKrathemis}/contract/analysis`,
        analysis,
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
