import { HttpClient, HttpContext, HttpErrorResponse }               from '@angular/common/http';
import { Injectable }                                               from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { API_TOKEN }                                                from 'src/app/core/interceptors/http.interceptor.service';
import { environment }                                              from 'src/environments/environment';

export interface TagRequest {
  id: string;
  status: boolean;
  isAccepted: boolean;
  createdAt: string;
  updatedAt: string;
  socialCommunity: any;
  user: any;
  company: any;
  seat: any;
}

export interface TagRequestResponse {
  data: TagRequest[];
  metadata: {
    page: number;
    total: number;
    lastPage: number;
  };
}

export interface TagRequestsState {
  data: TagRequest[];
  metadata: {
    page: number;
    total: number;
    lastPage: number;
  };
  loading: boolean;
  loaded: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class RequestTagsService {

  private pendingState$ = new BehaviorSubject<TagRequestsState>({
    data: [],
    metadata: { page: 1, total: 0, lastPage: 1 },
    loading: false,
    loaded: false
  });

  private acceptedState$ = new BehaviorSubject<TagRequestsState>({
    data: [],
    metadata: { page: 1, total: 0, lastPage: 1 },
    loading: false,
    loaded: false
  });

  private rejectedState$ = new BehaviorSubject<TagRequestsState>({
    data: [],
    metadata: { page: 1, total: 0, lastPage: 1 },
    loading: false,
    loaded: false
  });

  constructor(private http: HttpClient) {}

  get pendingState(): Observable<TagRequestsState> {
    return this.pendingState$.asObservable();
  }

  get acceptedState(): Observable<TagRequestsState> {
    return this.acceptedState$.asObservable();
  }

  get rejectedState(): Observable<TagRequestsState> {
    return this.rejectedState$.asObservable();
  }

  getAllCombinedData(): TagRequest[] {
    const pending = this.pendingState$.value.data;
    const accepted = this.acceptedState$.value.data;
    const rejected = this.rejectedState$.value.data;
    return [...pending, ...accepted, ...rejected];
  }

  getCombinedState(): TagRequestsState {
    const pending = this.pendingState$.value;
    const accepted = this.acceptedState$.value;
    const rejected = this.rejectedState$.value;

    const allData = [...pending.data, ...accepted.data, ...rejected.data];
    const totalItems = pending.metadata.total + accepted.metadata.total + rejected.metadata.total;
    const allLoaded = pending.loaded && accepted.loaded && rejected.loaded;
    const anyLoading = pending.loading || accepted.loading || rejected.loading;

    return {
      data: allData,
      metadata: {
        page: 1,
        total: totalItems,
        lastPage: 1
      },
      loading: anyLoading,
      loaded: allLoaded
    };
  }

  pendingTagRequests(userId: string, page: number = 1): Observable<TagRequestResponse> {
    return this.http.get<TagRequestResponse>(
      `${environment.apiKrathemis}/social-community/pending-tag-requests/${userId}?page=${page}`,
      {
        context: new HttpContext().set(API_TOKEN, { krathemis: true }),
      }
    ).pipe(
      catchError((error: HttpErrorResponse) => throwError(() => error))
    );
  }

  acceptedTagRequests(userId: string, page: number = 1): Observable<TagRequestResponse> {
    return this.http.get<TagRequestResponse>(
      `${environment.apiKrathemis}/social-community/accepted-tag-requests/${userId}?page=${page}`,
      {
        context: new HttpContext().set(API_TOKEN, { krathemis: true }),
      }
    ).pipe(
      catchError((error: HttpErrorResponse) => throwError(() => error))
    );
  }

  rejectedTagRequests(userId: string, page: number = 1): Observable<TagRequestResponse> {
    return this.http.get<TagRequestResponse>(
      `${environment.apiKrathemis}/social-community/rejected-tag-requests/${userId}?page=${page}`,
      {
        context: new HttpContext().set(API_TOKEN, { krathemis: true }),
      }
    ).pipe(
      catchError((error: HttpErrorResponse) => throwError(() => error))
    );
  }

  loadPendingTagRequests(userId: string, page: number = 1, forceReload: boolean = false): Observable<TagRequestResponse> {
    const currentState = this.pendingState$.value;

    if (currentState.loaded && !forceReload && page === currentState.metadata.page) {
      return new Observable(observer => {
        observer.next({ data: currentState.data, metadata: currentState.metadata });
        observer.complete();
      });
    }

    this.updateStateLoading(this.pendingState$, true);

    return this.pendingTagRequests(userId, page).pipe(
      tap(response => {
        this.updateState(this.pendingState$, response, page === 1);
      }),
      catchError(error => {
        this.updateStateLoading(this.pendingState$, false);
        return throwError(() => error);
      })
    );
  }

  loadAcceptedTagRequests(userId: string, page: number = 1, forceReload: boolean = false): Observable<TagRequestResponse> {
    const currentState = this.acceptedState$.value;

    if (currentState.loaded && !forceReload && page === currentState.metadata.page) {
      return new Observable(observer => {
        observer.next({ data: currentState.data, metadata: currentState.metadata });
        observer.complete();
      });
    }

    this.updateStateLoading(this.acceptedState$, true);

    return this.acceptedTagRequests(userId, page).pipe(
      tap(response => {
        this.updateState(this.acceptedState$, response, page === 1);
      }),
      catchError(error => {
        this.updateStateLoading(this.acceptedState$, false);
        return throwError(() => error);
      })
    );
  }

  loadRejectedTagRequests(userId: string, page: number = 1, forceReload: boolean = false): Observable<TagRequestResponse> {
    const currentState = this.rejectedState$.value;

    if (currentState.loaded && !forceReload && page === currentState.metadata.page) {
      return new Observable(observer => {
        observer.next({ data: currentState.data, metadata: currentState.metadata });
        observer.complete();
      });
    }

    this.updateStateLoading(this.rejectedState$, true);

    return this.rejectedTagRequests(userId, page).pipe(
      tap(response => {
        this.updateState(this.rejectedState$, response, page === 1);
      }),
      catchError(error => {
        this.updateStateLoading(this.rejectedState$, false);
        return throwError(() => error);
      })
    );
  }

  loadMorePending(userId: string): Observable<TagRequestResponse> | null {
    const currentState = this.pendingState$.value;
    if (currentState.loading || currentState.metadata.page >= currentState.metadata.lastPage) {
      return null;
    }
    return this.loadPendingTagRequests(userId, currentState.metadata.page + 1);
  }

  loadMoreAccepted(userId: string): Observable<TagRequestResponse> | null {
    const currentState = this.acceptedState$.value;
    if (currentState.loading || currentState.metadata.page >= currentState.metadata.lastPage) {
      return null;
    }
    return this.loadAcceptedTagRequests(userId, currentState.metadata.page + 1);
  }

  loadMoreRejected(userId: string): Observable<TagRequestResponse> | null {
    const currentState = this.rejectedState$.value;
    if (currentState.loading || currentState.metadata.page >= currentState.metadata.lastPage) {
      return null;
    }
    return this.loadRejectedTagRequests(userId, currentState.metadata.page + 1);
  }

  private updateState(
    state$: BehaviorSubject<TagRequestsState>,
    response: TagRequestResponse,
    resetData: boolean
  ): void {
    const currentState = state$.value;

    state$.next({
      data: resetData ? response.data : [...currentState.data, ...response.data],
      metadata: response.metadata,
      loading: false,
      loaded: true
    });
  }

  private updateStateLoading(state$: BehaviorSubject<TagRequestsState>, loading: boolean): void {
    state$.next({
      ...state$.value,
      loading
    });
  }

  clearAllStates(): void {
    const initialState: TagRequestsState = {
      data: [],
      metadata: { page: 1, total: 0, lastPage: 1 },
      loading: false,
      loaded: false
    };

    this.pendingState$.next(initialState);
    this.acceptedState$.next(initialState);
    this.rejectedState$.next(initialState);
  }

  clearPendingState(): void {
    this.pendingState$.next({
      data: [],
      metadata: { page: 1, total: 0, lastPage: 1 },
      loading: false,
      loaded: false
    });
  }

  clearAcceptedState(): void {
    this.acceptedState$.next({
      data: [],
      metadata: { page: 1, total: 0, lastPage: 1 },
      loading: false,
      loaded: false
    });
  }

  clearRejectedState(): void {
    this.rejectedState$.next({
      data: [],
      metadata: { page: 1, total: 0, lastPage: 1 },
      loading: false,
      loaded: false
    });
  }

  refreshPending(userId: string): Observable<TagRequestResponse> {
    return this.loadPendingTagRequests(userId, 1, true);
  }

  refreshAccepted(userId: string): Observable<TagRequestResponse> {
    return this.loadAcceptedTagRequests(userId, 1, true);
  }

  refreshRejected(userId: string): Observable<TagRequestResponse> {
    return this.loadRejectedTagRequests(userId, 1, true);
  }

  /**
   * Mueve un request de pendientes a aceptados
   */
  private moveRequestToAccepted(request: TagRequest): void {
    // Remover de pendientes
    const pendingState = this.pendingState$.value;
    const updatedPendingData = pendingState.data.filter(r => r.id !== request.id);

    this.pendingState$.next({
      ...pendingState,
      data: updatedPendingData,
      metadata: {
        ...pendingState.metadata,
        total: pendingState.metadata.total - 1
      }
    });

    // Agregar a aceptados (al inicio del array)
    const acceptedState = this.acceptedState$.value;
    const updatedRequest = {
      ...request,
      status: true,
      isAccepted: true,
      updatedAt: new Date().toISOString()
    };

    this.acceptedState$.next({
      ...acceptedState,
      data: [updatedRequest, ...acceptedState.data],
      metadata: {
        ...acceptedState.metadata,
        total: acceptedState.metadata.total + 1
      }
    });
  }

  /**
   * Mueve un request de pendientes a rechazados
   */
  private moveRequestToRejected(request: TagRequest): void {
    // Remover de pendientes
    const pendingState = this.pendingState$.value;
    const updatedPendingData = pendingState.data.filter(r => r.id !== request.id);

    this.pendingState$.next({
      ...pendingState,
      data: updatedPendingData,
      metadata: {
        ...pendingState.metadata,
        total: pendingState.metadata.total - 1
      }
    });

    // Agregar a rechazados (al inicio del array)
    const rejectedState = this.rejectedState$.value;
    const updatedRequest = {
      ...request,
      status: false,
      isAccepted: false,
      updatedAt: new Date().toISOString()
    };

    this.rejectedState$.next({
      ...rejectedState,
      data: [updatedRequest, ...rejectedState.data],
      metadata: {
        ...rejectedState.metadata,
        total: rejectedState.metadata.total + 1
      }
    });
  }

  /**
   * Remueve un request de aceptados (cuando se elimina)
   */
  private removeFromAccepted(tagId: string): void {
    const acceptedState = this.acceptedState$.value;
    const updatedData = acceptedState.data.filter(r => r.id !== tagId);

    this.acceptedState$.next({
      ...acceptedState,
      data: updatedData,
      metadata: {
        ...acceptedState.metadata,
        total: acceptedState.metadata.total - 1
      }
    });
  }

  accept(tagId: string, acceptingUserId: string, showSpinner = true) {
    return this.http.post<any>(
      `${environment.apiKrathemis}/social-community/accept-tag/${tagId}/${acceptingUserId}`,
      {},
      {
        context: new HttpContext().set(API_TOKEN, { krathemis: true, showSpinner }),
      }
    ).pipe(
      tap(() => {
        // Buscar el request en pendientes
        const pendingState = this.pendingState$.value;
        const request = pendingState.data.find(r => r.id === tagId);

        if (request) {
          this.moveRequestToAccepted(request);
        }
      }),
      catchError((error: HttpErrorResponse) => throwError(() => error))
    );
  }

  reject(tagId: string, rejectingUserId: string, showSpinner = true) {
    return this.http.post<any>(
      `${environment.apiKrathemis}/social-community/reject-tag/${tagId}/${rejectingUserId}`,
      {},
      {
        context: new HttpContext().set(API_TOKEN, { krathemis: true, showSpinner }),
      }
    ).pipe(
      tap(() => {
        // Buscar el request en pendientes o aceptados
        const pendingState = this.pendingState$.value;
        const acceptedState = this.acceptedState$.value;

        const pendingRequest = pendingState.data.find(r => r.id === tagId);
        const acceptedRequest = acceptedState.data.find(r => r.id === tagId);

        if (pendingRequest) {
          this.moveRequestToRejected(pendingRequest);
        } else if (acceptedRequest) {
          // Si se rechaza uno que estaba aceptado, removerlo de aceptados
          this.removeFromAccepted(tagId);
          this.moveRequestToRejected(acceptedRequest);
        }
      }),
      catchError((error: HttpErrorResponse) => throwError(() => error))
    );
  }
}
