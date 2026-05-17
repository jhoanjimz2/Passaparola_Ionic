import {
  HttpClient,
  HttpContext,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, catchError, throwError, Observable } from 'rxjs';

import { API_TOKEN } from 'src/app/core/interceptors/http.interceptor.service';
import { environment } from 'src/environments/environment';
import { BugReport } from '../interfaces/bug-report/bug-report.interface';

@Injectable({
  providedIn: 'root',
})
export class BugReportService {
  constructor(private http: HttpClient) {}

  create(bugReport: BugReport): Observable<BugReport> {
    return this.http
      .post<BugReport>(`${environment.apiKrathemis}/bug-report`, bugReport, {
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
}
