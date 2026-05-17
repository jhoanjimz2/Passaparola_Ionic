import { Injectable }                                                                        from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, Subject, switchMap, tap, throwError } from 'rxjs';
import { environment }                                                                       from 'src/environments/environment';
import { HttpClient, HttpContext, HttpErrorResponse, HttpParams }                            from '@angular/common/http';
import { API_TOKEN }                                                                         from 'src/app/core/interceptors/http.interceptor.service';
import { FindAllUserParams, SocialPostByUser, SocialTag }                                    from '../interfaces/social/social-post';
import { SocialSummary }                                                                     from '../interfaces/multiple-profile-business/social-summary';
import { CacheService }                                                                      from './cache.service';
import { CACHE_KEYS }                                                                        from '../constants/cache-keys';

// TTLs específicos para cada tipo de dato
const CACHE_TTL = {
  PROFILE:       5 * 60 * 1000, // 5 min
  FEED:          3 * 60 * 1000, // 3 min
  FOLLOWERS:     3 * 60 * 1000, // 3 min
  FOLLOW_STATUS: 2 * 60 * 1000, // 2 min
};

@Injectable({
  providedIn: 'root'
})
export class SocialService {

  private lastLoadedProfileId: string = '';
  private lastLoadedParams: {
    isPublic: boolean;
    showDetail: boolean;
    operativeMode?: boolean;
  } = {
    isPublic: false,
    showDetail: false,
    operativeMode: false
  };

  saveLastLoadedProfile(id: string, params: { isPublic: boolean; showDetail: boolean; operativeMode?: boolean }): void {
    this.lastLoadedProfileId = id;
    this.lastLoadedParams = params;
  }

  isSameProfile(id: string, params: { isPublic: boolean; showDetail: boolean; operativeMode?: boolean }): boolean {
    return (
      this.lastLoadedProfileId === id &&
      this.lastLoadedParams.isPublic === params.isPublic &&
      this.lastLoadedParams.showDetail === params.showDetail &&
      (params.operativeMode === undefined || this.lastLoadedParams.operativeMode === params.operativeMode)
    );
  }

  clearState(): void {
    this.seat$.next({} as SocialSummary);
    this.statusFollow$.next(false);
    this.operative$.next(false);
  }

  clearLastLoadedProfile(): void {
    this.lastLoadedProfileId = '';
    this.lastLoadedParams = { isPublic: false, showDetail: false, operativeMode: false };
  }

  // ─── BehaviorSubjects ──────────────────────────────────────────────────────

  private publicTokenCache: string | null = null;

  private seat$ = new BehaviorSubject<SocialSummary>({} as SocialSummary);
  get seatObservable(): Observable<SocialSummary> { return this.seat$.asObservable(); }
  set seatNext(data: SocialSummary) { this.seat$.next(data); }

  private operative$ = new BehaviorSubject<boolean>(false);
  get operativeObservable(): Observable<boolean> { return this.operative$.asObservable(); }
  set operativeNext(data: boolean) { this.operative$.next(data); }

  private showDetail$ = new BehaviorSubject<boolean>(false);
  get showDetailObservable(): Observable<boolean> { return this.showDetail$.asObservable(); }
  set showDetailNext(data: boolean) { this.showDetail$.next(data); }

  private statusFollow$ = new BehaviorSubject<boolean>(true);
  get statusFollowObservable(): Observable<boolean> { return this.statusFollow$.asObservable(); }
  set statusFollowNext(data: boolean) { this.statusFollow$.next(data); }

  public likeUpdatedSource = new Subject<any>();
  public likeUpdated$ = this.likeUpdatedSource.asObservable();

  constructor(
    private http: HttpClient,
    private cacheService: CacheService
  ) {}

  // ─── Helpers de caché públicos (para usar desde los componentes) ───────────

  /**
   * Invalida todo lo relacionado a un perfil: perfil, feeds, seguidores, boards.
   * Úsalo en handleRefresh() del componente.
   */
  invalidateProfileCache(id: string): void {
    this.cacheService.invalidatePattern(id);
  }

  /**
   * Invalida solo el feed de un tipo específico.
   * Úsalo después de crear un post nuevo.
   */
  invalidateFeedCache(id: string, feedType: 'feed' | 'like' | 'saved' | 'shared' = 'feed'): void {
    const keyMap: Record<string, string> = {
      feed:   CACHE_KEYS.feed(id),
      like:   CACHE_KEYS.feedLike(id),
      saved:  CACHE_KEYS.feedSaved(id),
      shared: CACHE_KEYS.feedShared(id),
    };
    this.cacheService.invalidatePattern(keyMap[feedType]);
  }

  // ─── Token público ─────────────────────────────────────────────────────────

  private getPublicToken(): Observable<string> {
    if (this.publicTokenCache) {
      return new Observable(observer => { observer.next(this.publicTokenCache!); observer.complete(); });
    }

    const storedToken = localStorage.getItem('appPassaparola_publicToken');
    if (storedToken) {
      this.publicTokenCache = storedToken;
      return new Observable(observer => { observer.next(storedToken); observer.complete(); });
    }

    return this.tokenPublic().pipe(
      map((response: any) => {
        const publicToken = response.token || response.access_token;
        this.publicTokenCache = publicToken;
        localStorage.setItem('appPassaparola_publicToken', publicToken);
        return publicToken;
      })
    );
  }

  // ─── Getters de usuario ────────────────────────────────────────────────────

  private get idUserOrCompany() {
    const user = this.getLocalStorageItem('appPassaparola_user');
    const seat = user?.rol === 'company'
      ? this.getLocalStorageItem('appPassaparola_loginSeat')
      : user;
    return seat?.id;
  }

  private get profileId() {
    const user = this.getLocalStorageItem('appPassaparola_user');
    return user?.profile?.id;
  }

  private getLocalStorageItem(key: string): any {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }

  // ─── Helper privado ────────────────────────────────────────────────────────

  private buildHttpParams(params: Record<string, any>): HttpParams {
    let httpParams = new HttpParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        httpParams = httpParams.set(key, value.toString());
      }
    });
    return httpParams;
  }

  // ─── Métodos de escritura (invalidan caché relevante) ─────────────────────

  create(createSocialTag: SocialTag): Observable<SocialTag> {
    return this.http.post<SocialTag>(
      `${environment.apiKrathemis}/social-community`,
      createSocialTag,
      { context: new HttpContext().set(API_TOKEN, { krathemis: true }) }
    ).pipe(
      catchError((error: HttpErrorResponse) => throwError(() => error))
    );
  }

  like(postIdToLike: string, showSpinner = true) {
    return this.http.post<any>(
      `${environment.apiKrathemis}/social-community/like-dislike/${postIdToLike}`,
      {},
      {
        params: { seatId: this.idUserOrCompany },
        context: new HttpContext().set(API_TOKEN, { krathemis: true, showSpinner }),
      }
    ).pipe(
      catchError((error: HttpErrorResponse) => throwError(() => error))
    );
  }

  save(postIdToSave: string) {
    return this.http.post<any>(
      `${environment.apiKrathemis}/social-community/save-unsave/${postIdToSave}`,
      {},
      {
        params: { seatId: this.idUserOrCompany },
        context: new HttpContext().set(API_TOKEN, { krathemis: true }),
      }
    ).pipe(
      catchError((error: HttpErrorResponse) => throwError(() => error))
    );
  }

  share(postIdToSave: string) {
    return this.http.post<any>(
      `${environment.apiKrathemis}/social-community/share-unshare/${postIdToSave}`,
      {},
      {
        params: { seatId: this.idUserOrCompany },
        context: new HttpContext().set(API_TOKEN, { krathemis: true }),
      }
    ).pipe(
      catchError((error: HttpErrorResponse) => throwError(() => error))
    );
  }

  /**
   * follow: invalida perfil + seguidores + followStatus del usuario afectado
   * para que la próxima visita refleje el cambio.
   */
  follow(userIdToFollow: string) {
    return this.http.post<any>(
      `${environment.apiKrathemis}/social-community/follow-unfollow/${userIdToFollow}/${this.idUserOrCompany}`,
      {},
      { context: new HttpContext().set(API_TOKEN, { krathemis: true }) }
    ).pipe(
      tap(() => {
        this.cacheService.invalidate(CACHE_KEYS.profile(userIdToFollow));
        this.cacheService.invalidate(CACHE_KEYS.followers(userIdToFollow));
        this.cacheService.invalidatePattern(`follow-status:${userIdToFollow}`);
      }),
      catchError((error: HttpErrorResponse) => throwError(() => error))
    );
  }

  viewPost(socialCommunityId: string): Observable<any> {
    return this.http.post(
      `${environment.apiKrathemis}/social-community/view/${socialCommunityId}`,
      {},
      {
        context: new HttpContext().set(API_TOKEN, { krathemis: true, showSpinner: false }),
        params: { seatId: this.idUserOrCompany }
      }
    ).pipe(
      catchError((error: HttpErrorResponse) => throwError(() => error))
    );
  }

  // ─── Métodos de lectura CON caché ─────────────────────────────────────────

  getPost(id: string): Observable<any> {
    const cacheKey = `post:${id}`;
    return this.cacheService.wrap(
      cacheKey,
      this.http.get<any>(
        `${environment.apiKrathemis}/social-community/${id}`,
        { context: new HttpContext().set(API_TOKEN, { krathemis: true }) }
      ).pipe(catchError((error: HttpErrorResponse) => throwError(() => error))),
      CACHE_TTL.FEED
    );
  }

  findAll(params: FindAllUserParams): Observable<SocialPostByUser> {
    return this.http.get<SocialPostByUser>(
      `${environment.apiKrathemis}/social-community`,
      { params: this.buildHttpParams(params), context: new HttpContext().set(API_TOKEN, { krathemis: true }) }
    ).pipe(
      catchError((error: HttpErrorResponse) => throwError(() => error))
    );
  }

  findAllByCommunity(params: FindAllUserParams): Observable<SocialPostByUser> {
    return this.http.get<SocialPostByUser>(
      `${environment.apiKrathemis}/social-community/find-all/by-community`,
      { params: this.buildHttpParams(params), context: new HttpContext().set(API_TOKEN, { krathemis: true }) }
    ).pipe(
      catchError((error: HttpErrorResponse) => throwError(() => error))
    );
  }

  /** Feed principal: cachea por id + página (offset) */
  findAllUser(params: FindAllUserParams, id: string): Observable<SocialPostByUser> {
    const cacheKey = `${CACHE_KEYS.feed(id)}:p${params.offset}`;
    return this.cacheService.wrap(
      cacheKey,
      this.http.get<SocialPostByUser>(
        `${environment.apiKrathemis}/social-community/find-all/by-user/${id}`,
        { params: this.buildHttpParams(params), context: new HttpContext().set(API_TOKEN, { krathemis: true }) }
      ).pipe(catchError((error: HttpErrorResponse) => throwError(() => error))),
      CACHE_TTL.FEED
    );
  }

  findAllUserPublic(params: any, id: string): Observable<SocialPostByUser> {
    const cacheKey = `${CACHE_KEYS.feed(id)}:public:p${params.offset}`;
    return this.cacheService.wrap(
      cacheKey,
      this.getPublicToken().pipe(
        switchMap(() => this.http.get<SocialPostByUser>(
          `${environment.apiKrathemis}/social-community/find-all/by-user/${id}`,
          { params: this.buildHttpParams(params), context: new HttpContext().set(API_TOKEN, { krathemis: true, isPublic: true }) }
        )),
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.publicTokenCache = null;
            localStorage.removeItem('appPassaparola_publicToken');
          }
          return throwError(() => error);
        })
      ),
      CACHE_TTL.FEED
    );
  }

  /** Feed de likes: cachea por id + página */
  findAllUserLike(params: FindAllUserParams, seatId: string): Observable<SocialPostByUser> {
    const cacheKey = `${CACHE_KEYS.feedLike(seatId)}:p${params.offset}`;
    return this.cacheService.wrap(
      cacheKey,
      this.http.get<SocialPostByUser>(
        `${environment.apiKrathemis}/social-community/liked-posts/${seatId}`,
        { params: this.buildHttpParams(params), context: new HttpContext().set(API_TOKEN, { krathemis: true }) }
      ).pipe(catchError((error: HttpErrorResponse) => throwError(() => error))),
      CACHE_TTL.FEED
    );
  }

  /** Feed de guardados: cachea por id + página */
  findAllUserSaved(params: FindAllUserParams, seatId: string): Observable<SocialPostByUser> {
    const cacheKey = `${CACHE_KEYS.feedSaved(seatId)}:p${params.offset}`;
    return this.cacheService.wrap(
      cacheKey,
      this.http.get<SocialPostByUser>(
        `${environment.apiKrathemis}/social-community/saved-posts/${seatId}`,
        { params: this.buildHttpParams(params), context: new HttpContext().set(API_TOKEN, { krathemis: true }) }
      ).pipe(catchError((error: HttpErrorResponse) => throwError(() => error))),
      CACHE_TTL.FEED
    );
  }

  /** Feed de compartidos: cachea por id + página */
  findAllUserShared(params: FindAllUserParams, seatId: string): Observable<SocialPostByUser> {
    const cacheKey = `${CACHE_KEYS.feedShared(seatId)}:p${params.offset}`;
    return this.cacheService.wrap(
      cacheKey,
      this.http.get<SocialPostByUser>(
        `${environment.apiKrathemis}/social-community/shared-posts/${seatId}`,
        { params: this.buildHttpParams(params), context: new HttpContext().set(API_TOKEN, { krathemis: true }) }
      ).pipe(catchError((error: HttpErrorResponse) => throwError(() => error))),
      CACHE_TTL.FEED
    );
  }

  // ─── Tags con caché ────────────────────────────────────────────────────────

  productsTagByUser(params: FindAllUserParams, seatId: string): Observable<any> {
    const cacheKey = `tags:products:${seatId}:p${params.offset}`;
    return this.cacheService.wrap(
      cacheKey,
      this.http.get<any>(
        `${environment.apiKrathemis}/social-community/products-tag/${seatId}`,
        { params: this.buildHttpParams(params), context: new HttpContext().set(API_TOKEN, { krathemis: true }) }
      ).pipe(catchError((error: HttpErrorResponse) => throwError(() => error))),
      CACHE_TTL.FEED
    );
  }

  storesTagByUser(params: FindAllUserParams, seatId: string): Observable<any> {
    const cacheKey = `tags:stores:${seatId}:p${params.offset}`;
    return this.cacheService.wrap(
      cacheKey,
      this.http.get<any>(
        `${environment.apiKrathemis}/social-community/stores-tag/${seatId}`,
        { params: this.buildHttpParams(params), context: new HttpContext().set(API_TOKEN, { krathemis: true }) }
      ).pipe(catchError((error: HttpErrorResponse) => throwError(() => error))),
      CACHE_TTL.FEED
    );
  }

  eventsTagByUser(params: FindAllUserParams, seatId: string): Observable<any> {
    const cacheKey = `tags:events:${seatId}:p${params.offset}`;
    return this.cacheService.wrap(
      cacheKey,
      this.http.get<any>(
        `${environment.apiKrathemis}/social-community/events-tag/${seatId}`,
        { params: this.buildHttpParams(params), context: new HttpContext().set(API_TOKEN, { krathemis: true }) }
      ).pipe(catchError((error: HttpErrorResponse) => throwError(() => error))),
      CACHE_TTL.FEED
    );
  }

  projectsTagByUser(params: FindAllUserParams, seatId: string): Observable<any> {
    const cacheKey = `tags:projects:${seatId}:p${params.offset}`;
    return this.cacheService.wrap(
      cacheKey,
      this.http.get<any>(
        `${environment.apiKrathemis}/social-community/projects-tag/${seatId}`,
        { params: this.buildHttpParams(params), context: new HttpContext().set(API_TOKEN, { krathemis: true }) }
      ).pipe(catchError((error: HttpErrorResponse) => throwError(() => error))),
      CACHE_TTL.FEED
    );
  }

  productsTagByUserPublic(params: FindAllUserParams, seatId: string): Observable<any> {
    const cacheKey = `tags:products:${seatId}:public:p${params.offset}`;
    return this.cacheService.wrap(
      cacheKey,
      this.getPublicToken().pipe(
        switchMap(() => this.http.get<any>(
          `${environment.apiKrathemis}/social-community/products-tag/${seatId}`,
          { params: this.buildHttpParams(params), context: new HttpContext().set(API_TOKEN, { krathemis: true, isPublic: true }) }
        )),
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) { this.publicTokenCache = null; localStorage.removeItem('appPassaparola_publicToken'); }
          return throwError(() => error);
        })
      ),
      CACHE_TTL.FEED
    );
  }

  storesTagByUserPublic(params: FindAllUserParams, seatId: string): Observable<any> {
    const cacheKey = `tags:stores:${seatId}:public:p${params.offset}`;
    return this.cacheService.wrap(
      cacheKey,
      this.getPublicToken().pipe(
        switchMap(() => this.http.get<any>(
          `${environment.apiKrathemis}/social-community/stores-tag/${seatId}`,
          { params: this.buildHttpParams(params), context: new HttpContext().set(API_TOKEN, { krathemis: true, isPublic: true }) }
        )),
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) { this.publicTokenCache = null; localStorage.removeItem('appPassaparola_publicToken'); }
          return throwError(() => error);
        })
      ),
      CACHE_TTL.FEED
    );
  }

  eventsTagByUserPublic(params: FindAllUserParams, seatId: string): Observable<any> {
    const cacheKey = `tags:events:${seatId}:public:p${params.offset}`;
    return this.cacheService.wrap(
      cacheKey,
      this.getPublicToken().pipe(
        switchMap(() => this.http.get<any>(
          `${environment.apiKrathemis}/social-community/events-tag/${seatId}`,
          { params: this.buildHttpParams(params), context: new HttpContext().set(API_TOKEN, { krathemis: true, isPublic: true }) }
        )),
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) { this.publicTokenCache = null; localStorage.removeItem('appPassaparola_publicToken'); }
          return throwError(() => error);
        })
      ),
      CACHE_TTL.FEED
    );
  }

  projectsTagByUserPublic(params: FindAllUserParams, seatId: string): Observable<any> {
    const cacheKey = `tags:projects:${seatId}:public:p${params.offset}`;
    return this.cacheService.wrap(
      cacheKey,
      this.getPublicToken().pipe(
        switchMap(() => this.http.get<any>(
          `${environment.apiKrathemis}/social-community/projects-tag/${seatId}`,
          { params: this.buildHttpParams(params), context: new HttpContext().set(API_TOKEN, { krathemis: true, isPublic: true }) }
        )),
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) { this.publicTokenCache = null; localStorage.removeItem('appPassaparola_publicToken'); }
          return throwError(() => error);
        })
      ),
      CACHE_TTL.FEED
    );
  }

  // ─── similarPost (sin caché – resultado único por par userId/socialId) ─────

  similarPost(params: FindAllUserParams, userId: string, socialId: string): Observable<SocialPostByUser> {
    const cacheKey = `similar:${socialId}:${userId}:p${params.offset}`;
    return this.cacheService.wrap(
      cacheKey,
      this.http.get<SocialPostByUser>(
        `${environment.apiKrathemis}/social-community/similar-social-by-id/${userId}/${socialId}`,
        { params: this.buildHttpParams(params), context: new HttpContext().set(API_TOKEN, { krathemis: true }) }
      ).pipe(catchError((error: HttpErrorResponse) => throwError(() => error))),
      CACHE_TTL.FEED
    );
  }

  // ─── socialSummary CON caché ───────────────────────────────────────────────

  /**
   * Perfil autenticado: cachea 5 min.
   * Se invalida automáticamente al hacer follow() o al llamar invalidateProfileCache(id).
   */
  socialSummary(userID: string, showSpinner = true): Observable<SocialSummary> {
    const cacheKey = CACHE_KEYS.profile(userID);
    return this.cacheService.wrap(
      cacheKey,
      this.http.get<SocialSummary>(
        `${environment.apiKrathemis}/social-community/social-summary/${userID}`,
        { context: new HttpContext().set(API_TOKEN, { krathemis: true, showSpinner }) }
      ).pipe(catchError((error: HttpErrorResponse) => throwError(() => error))),
      CACHE_TTL.PROFILE
    );
  }

  /**
   * Perfil público: cachea 5 min con key separada para no mezclar con el autenticado.
   */
  socialSummaryPublic(id: string): Observable<SocialSummary> {
    const cacheKey = `${CACHE_KEYS.profile(id)}:public`;
    return this.cacheService.wrap(
      cacheKey,
      this.getPublicToken().pipe(
        switchMap(() => this.http.get<SocialSummary>(
          `${environment.apiKrathemis}/social-community/social-summary/${id}`,
          { context: new HttpContext().set(API_TOKEN, { krathemis: true, isPublic: true }) }
        )),
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.publicTokenCache = null;
            localStorage.removeItem('appPassaparola_publicToken');
          }
          return throwError(() => error);
        })
      ),
      CACHE_TTL.PROFILE
    );
  }

  mySocialSummary(): Observable<any> {
    return this.http.get<any>(
      `${environment.apiKrathemis}/social-community/find/my-social-summary`,
      { context: new HttpContext().set(API_TOKEN, { krathemis: true }) }
    ).pipe(
      catchError((error: HttpErrorResponse) => throwError(() => error))
    );
  }

  /**
   * followStatus CON caché 2 min.
   * Se invalida automáticamente en follow().
   */
  followStatus(userId: string, showSpinner = true): Observable<any> {
    const cacheKey = `follow-status:${userId}`;
    return this.cacheService.wrap(
      cacheKey,
      this.http.get<any>(
        `${environment.apiKrathemis}/social-community/follow-status/${userId}/${this.idUserOrCompany}`,
        { context: new HttpContext().set(API_TOKEN, { krathemis: true, showSpinner }) }
      ).pipe(catchError((error: HttpErrorResponse) => throwError(() => error))),
      CACHE_TTL.FOLLOW_STATUS
    );
  }

  likeStatus(socialCommunityId: string): Observable<any> {
    return this.http.get<any>(
      `${environment.apiKrathemis}/social-community/like-status/${socialCommunityId}/${this.idUserOrCompany}`,
      {
        context: new HttpContext().set(API_TOKEN, { krathemis: true })
      }
    ).pipe(
      catchError((error: HttpErrorResponse) => throwError(() => error))
    );
  }

  saveStatus(socialCommunityId: string): Observable<any> {
    return this.http.get<any>(
      `${environment.apiKrathemis}/social-community/save-status/${socialCommunityId}/${this.idUserOrCompany}`,
      {
        context: new HttpContext().set(API_TOKEN, { krathemis: true })
      }
    ).pipe(
      catchError((error: HttpErrorResponse) => throwError(() => error))
    );
  }

  tokenPublic() {
    return this.http.post<any>(
      `${environment.apiKrathemis}/auth/public-authentication`,
      {},
      { context: new HttpContext().set(API_TOKEN, { krathemisBasic: true, showSpinner: true }) }
    ).pipe(
      catchError((error: HttpErrorResponse) => throwError(() => error))
    );
  }
}
