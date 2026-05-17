import { HttpClient, HttpContext, HttpErrorResponse, HttpParams }                                     from '@angular/common/http';
import { Injectable }                                                                                 from '@angular/core';
import { BehaviorSubject, catchError, forkJoin, map, Observable, of, tap, throwError }                from 'rxjs';
import { API_TOKEN }                                                                                  from 'src/app/core/interceptors/http.interceptor.service';
import { environment }                                                                                from 'src/environments/environment';
import { Voucher }                                                                                    from '../interfaces/vouchers/vouchers';
import { User }                                                                                       from '../interfaces/user/user.interface';

@Injectable({
  providedIn: 'root'
})
export class VouchersService {

  private user: User       = {} as User;
  private myVouchersComprados$ = new BehaviorSubject<Voucher[]>([]);
  private myVouchersCreados$ = new BehaviorSubject<Voucher[]>([]);
  private allVouchers$ = new BehaviorSubject<Voucher[]>([]);

  constructor(private http: HttpClient) {
    this.dataGeneralVouchers()
  }

  dataGeneralVouchers() {
    this.user = JSON.parse(localStorage.getItem('appPassaparola_user')!);
    forkJoin([
      this.getAllVouchers({}),
      this.getAllMyVouchersComprados({}),
      this.user.rol === 'company' ? this.getAllMyVouchersCreated({}) : of([])
    ]).subscribe();
  }

  obtenerAllVouchers(): Observable<Voucher[]> {
    return this.allVouchers$.asObservable();
  }
  obtenerMyVouchersCreated(): Observable<Voucher[]> {
    return this.myVouchersCreados$.asObservable();
  }
  obtenerMyVouchersComprados(): Observable<Voucher[]> {
    return this.myVouchersComprados$.asObservable();
  }

  activeInactive(id: string) {
    return this.http.patch<Voucher[]>(`${environment.apiKrathemis}/digital-object/offer/activate-deactivate/${id}`, {}, {
      context: new HttpContext().set(API_TOKEN, { krathemis: true })
    }).pipe(
      tap(() => forkJoin([
        this.getAllVouchers({}),
        this.getAllMyVouchersCreated({})
      ]).subscribe()),
      catchError((error: HttpErrorResponse) => throwError(() => error))
    );
  }

  createVoucher(voucher: Voucher) {
    return this.http.post<Voucher[]>(`${environment.apiKrathemis}/digital-object/offer`, {...voucher}, {
      context: new HttpContext().set(API_TOKEN, { krathemis: true })
    }).pipe(
      tap(() => forkJoin([
        this.getAllVouchers({}),
        this.getAllMyVouchersCreated({})
      ]).subscribe()),
      catchError((error: HttpErrorResponse) => throwError(() => error))
    );
  }


  getAllVouchers({ keyword = '', offset = 0, limit = 10 }: {
    languageCode?: string; keyword?: string; offset?: number; limit?: number;
  }): Observable<Voucher[]> {
    let httpParams = new HttpParams()
    .set('limit', limit.toString())
    .set('offset', offset.toString())
    .set('keyword', keyword.toString())
    .set('languageCode', 'IT');
    return this.http.get<Voucher[]>(`${environment.apiKrathemis}/digital-object/offers/find-all`,{
      context: new HttpContext().set(API_TOKEN, { krathemis: true }), params: httpParams  })
      .pipe(tap((events: Voucher[]) => this.allVouchers$.next(events)),
      catchError((error: HttpErrorResponse) => throwError(() => error))
    );
  }

  getAllMyVouchersCreated({ keyword = '', offset = 0, limit = 10 }: {
    languageCode?: string; keyword?: string; offset?: number; limit?: number;
  }): Observable<Voucher[]> {
    let httpParams = new HttpParams()
    .set('limit', limit.toString())
    .set('offset', offset.toString())
    .set('keyword', keyword.toString())
    .set('languageCode', 'IT');
    return this.http.get<Voucher[]>(`${environment.apiKrathemis}/digital-object/offers/find-all-by-company`,{
      context: new HttpContext().set(API_TOKEN, { krathemis: true }), params: httpParams  })
      .pipe(tap((events: Voucher[]) => this.myVouchersCreados$.next(events)),
      catchError((error: HttpErrorResponse) => throwError(() => error))
    );
  }

  getAllMyVouchersComprados({ keyword = '', offset = 0, limit = 10 }: {
    languageCode?: string; keyword?: string; offset?: number; limit?: number;
  }): Observable<Voucher[]> {
    let httpParams = new HttpParams()
    .set('limit', limit.toString())
    .set('offset', offset.toString())
    .set('keyword', keyword.toString())
    .set('languageCode', 'IT');
    return this.http.get<Voucher[]>(`${environment.apiKrathemis}/digital-object/find-all-by-user`,{
      context: new HttpContext().set(API_TOKEN, { krathemis: true }), params: httpParams  })
      .pipe(tap((events: Voucher[]) => this.myVouchersComprados$.next(events)),
      catchError((error: HttpErrorResponse) => throwError(() => error))
    );
  }

}
