import { HttpClient, HttpContext, HttpErrorResponse, HttpParams }                   from '@angular/common/http';
import { Injectable }                                                               from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, switchMap, tap, throwError } from 'rxjs';
import { API_TOKEN }                                                                from 'src/app/core/interceptors/http.interceptor.service';
import { environment }                                                              from 'src/environments/environment';
import { Wishbuy }                                                                  from '../interfaces/jointlybuy/wishbuy';
import { RespWillbuy, Willbuy }                                                     from '../interfaces/jointlybuy/willbuy';
import { CategoryWillbuy }                                                          from '../interfaces/jointlybuy/category';
import { RequestTransactionWillbuy }                                                from '../interfaces/jointlybuy/payments';
import { Notification, NotificationType, WishbuyWillbuyNotificationType }           from '../interfaces/jointlybuy/notifications';

export interface Params {
  limit?: number;
  offset?: number;
  keyword?: string;
  languageCode?: string;
  category?: string;
  type?: NotificationType;
  wishbuyWillbuyNotificationType?: WishbuyWillbuyNotificationType;
}

@Injectable({
  providedIn: 'root'
})
export class JointlybuyService {

  private allCategoryWillbuy$ = new BehaviorSubject<CategoryWillbuy[]>([]);
  private willbuy$ = new BehaviorSubject<Willbuy>({} as Willbuy);

  private allNotification$ = new BehaviorSubject<Notification[]>([]);
  private hasUnreadNotifications$ = new BehaviorSubject<boolean>(false);

  private allWillbuy$ = new BehaviorSubject<Willbuy[]>([]);
  private allWillbuyByCategory$ = new BehaviorSubject<Willbuy[]>([]);
  private allWillbuyDeadline$ = new BehaviorSubject<Willbuy[]>([]);
  private allWillbuyPopular$ = new BehaviorSubject<Willbuy[]>([]);

  constructor(
    private http: HttpClient
  ) {}

  allCategoryWillbuy(): Observable<CategoryWillbuy[]> {
    return this.allCategoryWillbuy$.asObservable();
  }

  allNotification(): Observable<Notification[]> {
    return this.allNotification$.asObservable();
  }

  /**
   * Observable que indica si hay notificaciones sin leer
   * @returns Observable<boolean> - true si hay notificaciones sin leer, false si no
   */
  hasUnreadNotifications(): Observable<boolean> {
    return this.hasUnreadNotifications$.asObservable();
  }

  willbuy(): Observable<Willbuy> {
    return this.willbuy$.asObservable();
  }

  allWillbuy(): Observable<Willbuy[]> {
    return this.allWillbuy$.asObservable();
  }

  allWillbuyByCategory(): Observable<Willbuy[]> {
    return this.allWillbuyByCategory$.asObservable();
  }

  allWillbuyDeadline(): Observable<Willbuy[]> {
    return this.allWillbuyDeadline$.asObservable();
  }

  allWillbuyPopular(): Observable<Willbuy[]> {
    return this.allWillbuyPopular$.asObservable();
  }

  clearWillbuys() {
    this.allWillbuy$.next([]);
  }

  clearWillbuysByCategory() {
    this.allWillbuyByCategory$.next([]);
  }

  clearWillbuysDeadline() {
    this.allWillbuyDeadline$.next([]);
  }
  clearWillbuysPopular() {
    this.allWillbuyPopular$.next([]);
  }

  clearWillbuysViews() {
    this.allWillbuyPopular$.next([]);
  }
  private updateUnreadNotificationsStatus(notifications: Notification[]): void {
    const validTypes = [
      NotificationType.willbuyInvestes,
      NotificationType.willbuyManaged,
      NotificationType.wishbuy,
      NotificationType.willbuy
    ];

    const hasUnread = notifications.some(notification =>
      !notification.isRead &&
      notification.type &&
      validTypes.includes(notification.type)
    );

    this.hasUnreadNotifications$.next(hasUnread);
  }

  loadCategoryWillbuy(params: Params) {
    let httpParams = new HttpParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        httpParams = httpParams.set(key, value.toString());
      }
    });
    return this.http.get<CategoryWillbuy[]>(
      `${environment.apiKrathemis}/product-category/find-all/with-children`,
      {
        params: httpParams,
        context: new HttpContext().set(API_TOKEN, { krathemis: true }),
      }
    )
    .pipe(tap((categoryWillbuy: CategoryWillbuy[]) => this.allCategoryWillbuy$.next(categoryWillbuy || [])))
    .pipe(catchError((error: HttpErrorResponse) => {return throwError(() => error)}));
  }

  loadWillbuys(params: Params, accumulate = false) {
    let httpParams = new HttpParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        httpParams = httpParams.set(key, value.toString());
      }
    });
    const hasCategoryFilter = params.category !== undefined && params.category !== null && params.category !== '';
    return this.http.get<RespWillbuy>(
      `${environment.apiKrathemis}/product/willbuy/find-all`,
      {
        params: httpParams,
        context: new HttpContext().set(API_TOKEN, { krathemis: true }),
      }
    )
    .pipe(
      tap((respWillbuy: RespWillbuy) => {
        const newData = respWillbuy.data || [];
        if (hasCategoryFilter) {
          if (accumulate) {
            const currentData = this.allWillbuyByCategory$.value;
            const existingIds = new Set(currentData.map(wb => wb.id));
            const filteredNewData = newData.filter(wb => !existingIds.has(wb.id));
            this.allWillbuyByCategory$.next([...currentData, ...filteredNewData]);
          } else {
            this.allWillbuyByCategory$.next(newData);
          }
        } else {
          if (accumulate) {
            const currentData = this.allWillbuy$.value;
            const existingIds = new Set(currentData.map(wb => wb.id));
            const filteredNewData = newData.filter(wb => !existingIds.has(wb.id));
            this.allWillbuy$.next([...currentData, ...filteredNewData]);
          } else {
            this.allWillbuy$.next(newData);
          }
        }
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  loadWillbuysDeadline(params: Params, accumulate = false) {
    let httpParams = new HttpParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        httpParams = httpParams.set(key, value.toString());
      }
    });
    return this.http.get<RespWillbuy>(
      `${environment.apiKrathemis}/product/willbuy/find-all-by-buy-end`,
      {
        params: httpParams,
        context: new HttpContext().set(API_TOKEN, { krathemis: true }),
      }
    )
    .pipe(
      tap((respWillbuy: RespWillbuy) => {
        const newData = respWillbuy.data || [];
        if (accumulate) {
          const currentData = this.allWillbuyDeadline$.value;
          const existingIds = new Set(currentData.map(wb => wb.id));
          const filteredNewData = newData.filter(wb => !existingIds.has(wb.id));
          this.allWillbuyDeadline$.next([...currentData, ...filteredNewData]);
        } else {
          this.allWillbuyDeadline$.next(newData);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  loadWillbuysPopular(params: Params, accumulate = false) {
    let httpParams = new HttpParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        httpParams = httpParams.set(key, value.toString());
      }
    });
    return this.http.get<RespWillbuy>(
      `${environment.apiKrathemis}/product/willbuy/find-all/populate`,
      {
        params: httpParams,
        context: new HttpContext().set(API_TOKEN, { krathemis: true }),
      }
    )
    .pipe(
      tap((respWillbuy: RespWillbuy) => {
        const newData = respWillbuy.data || [];
        if (accumulate) {
          const currentData = this.allWillbuyPopular$.value;
          const existingIds = new Set(currentData.map(wb => wb.id));
          const filteredNewData = newData.filter(wb => !existingIds.has(wb.id));
          this.allWillbuyPopular$.next([...currentData, ...filteredNewData]);
        } else {
          this.allWillbuyPopular$.next(newData);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  loadWillbuyForId(id: string) {
    return this.http.get<Willbuy>(
      `${environment.apiKrathemis}/product/wishbuy/${id}`,
      {
        context: new HttpContext().set(API_TOKEN, { krathemis: true }),
      }
    )
    .pipe(
      tap((willbuy: Willbuy) => this.willbuy$.next(willbuy)),
      switchMap((willbuy: Willbuy) => this.viewWillbuy(willbuy.id!)),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }


  loadWillbuyForIdPublic(id: string) {
    return this.tokenPublic().pipe(
      switchMap((response: any) => {
        const publicToken = response.token || response.access_token;
        localStorage.setItem('appPassaparola_publicToken', publicToken);
        return this.http.get<Willbuy>(
          `${environment.apiKrathemis}/product/wishbuy/${id}`,
          {
            context: new HttpContext().set(API_TOKEN, {
              krathemis: true,
              isPublic: true
            }),
          }
        );
      }),
      tap((willbuy: Willbuy) => this.willbuy$.next(willbuy)),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  tokenPublic() {
    return this.http.post<any>(
      `${environment.apiKrathemis}/auth/public-authentication`,{},
      { context: new HttpContext().set(API_TOKEN, { krathemisBasic: true, showSpinner: true })}
    )
    .pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  viewWillbuy(id: string) {
    return this.http.post<Willbuy>(
      `${environment.apiKrathemis}/product/willbuy-view`,
      { "status": true, "willbuy": { id } },
      { context: new HttpContext().set(API_TOKEN, { krathemis: true, showSpinner: false }) }
    )
    .pipe(catchError((error: HttpErrorResponse) => {return throwError(() => error)}));
  }







  //Pay WishBuy
  willbuyTransaction(request: RequestTransactionWillbuy) {
    return this.http.post<Willbuy>(
      `${environment.apiKrathemis}/product/willbuy-transaction`,
      request,
      { context: new HttpContext().set(API_TOKEN, { krathemis: true }) }
    )
    .pipe(catchError((error: HttpErrorResponse) => {return throwError(() => error)}));
  }




  //Notifications
  getNotifications(params: Params) {
    let httpParams = new HttpParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        httpParams = httpParams.set(key, value.toString());
      }
    });
    return this.http.get<Notification[]>(
      `${environment.apiKrathemis}/push-notification/find-all-by-user`,
      {
        params: httpParams,
        context: new HttpContext().set(API_TOKEN, { krathemis: true }),
      }
    ).pipe(
      tap((notifications: Notification[]) => {
        this.allNotification$.next(notifications);
        this.updateUnreadNotificationsStatus(notifications);
      }),
      catchError((error: HttpErrorResponse) => {return throwError(() => error)})
    );
  }

  updateNotification(notification: Notification, id: string) {
    return this.http.patch<any>(
      `${environment.apiKrathemis}/push-notification/read/${id}`,
      notification,
      {
        context: new HttpContext().set(API_TOKEN, { krathemis: true })
      }
    ).pipe(
      tap((updatedNotification: Notification) => {
        // Obtener el array actual de notificaciones
        const currentNotifications = this.allNotification$.value;

        // Buscar el índice de la notificación a actualizar
        const index = currentNotifications.findIndex(n => n.id === id);

        // Si se encuentra, reemplazarla con la versión actualizada
        if (index !== -1) {
          const updatedNotifications = [...currentNotifications];
          updatedNotifications[index] = updatedNotification;
          this.allNotification$.next(updatedNotifications);
          // Actualizar el estado de notificaciones sin leer
          this.updateUnreadNotificationsStatus(updatedNotifications);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

















  // SearchBar Services
  loadWillbuysSearchBar(params: Params) {
    let httpParams = new HttpParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        httpParams = httpParams.set(key, value.toString());
      }
    });
    return this.http.get<RespWillbuy>(
      `${environment.apiKrathemis}/product/willbuy/find-all`,
      {
        params: httpParams,
        context: new HttpContext().set(API_TOKEN, { krathemis: true }),
      }
    )
    .pipe(catchError((error: HttpErrorResponse) => {return throwError(() => error)}));
  }
  loadWillbuysDeadlineSearchBar(params: Params) {
    let httpParams = new HttpParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        httpParams = httpParams.set(key, value.toString());
      }
    });
    return this.http.get<RespWillbuy>(
      `${environment.apiKrathemis}/product/willbuy/find-all-by-buy-end`,
      {
        params: httpParams,
        context: new HttpContext().set(API_TOKEN, { krathemis: true }),
      }
    )
    .pipe(catchError((error: HttpErrorResponse) => {return throwError(() => error)}));
  }
  loadWillbuysPopularSearchBar(params: Params) {
    let httpParams = new HttpParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        httpParams = httpParams.set(key, value.toString());
      }
    });
    return this.http.get<RespWillbuy>(
      `${environment.apiKrathemis}/product/willbuy/find-all/populate`,
      {
        params: httpParams,
        context: new HttpContext().set(API_TOKEN, { krathemis: true }),
      }
    )
    .pipe(catchError((error: HttpErrorResponse) => {return throwError(() => error)}));
  }












  createWishbuy(wishbuy: Wishbuy) {
    return this.http.post<any>(`${environment.apiKrathemis}/product/wishbuy`,
        { ...wishbuy },
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
