import { HttpClient, HttpContext, HttpErrorResponse, HttpParams }                from '@angular/common/http';
import { Injectable }                                                            from '@angular/core';
import { catchError, forkJoin, map, Observable, tap, throwError }                from 'rxjs';
import { API_TOKEN }                                                             from 'src/app/core/interceptors/http.interceptor.service';
import { environment }                                                           from 'src/environments/environment';
import { FindAllUserParams }                                                     from '../interfaces/social/social-post';
import { CacheService }                                                          from './cache.service';

const FOLLOWERS_TTL = 3 * 60 * 1000; // 3 minutos

@Injectable({
  providedIn: 'root'
})
export class FollowersService {

  constructor(
    private http: HttpClient,
    private cacheService: CacheService
  ) {}

  // ─── Helpers ──────────────────────────────────────────────────────────────

  private buildParams(params: FindAllUserParams): HttpParams {
    let httpParams = new HttpParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        httpParams = httpParams.set(key, value.toString());
      }
    });
    return httpParams;
  }

  private followersCacheKey(type: string, seatId: string, offset: number): string {
    return `followers:${type}:${seatId}:p${offset}`;
  }

  // ─── findAllFollowers ─────────────────────────────────────────────────────

  findAllFollowers(params: FindAllUserParams, seatId: string): Observable<any> {
    const cacheKey = this.followersCacheKey('followers', seatId, params.offset as number);
    return this.cacheService.wrap(
      cacheKey,
      this.http.get<any>(
        `${environment.apiKrathemis}/social-community/find-all/followers/${seatId}`,
        {
          params: this.buildParams(params),
          context: new HttpContext().set(API_TOKEN, { krathemis: true }),
        }
      ).pipe(catchError((error: HttpErrorResponse) => throwError(() => error))),
      FOLLOWERS_TTL
    );
  }

  // ─── findAllFollowing ─────────────────────────────────────────────────────

  findAllFollowing(params: FindAllUserParams, seatId: string): Observable<any> {
    const cacheKey = this.followersCacheKey('following', seatId, params.offset as number);
    return this.cacheService.wrap(
      cacheKey,
      this.http.get<any>(
        `${environment.apiKrathemis}/social-community/find-all/following-users/${seatId}`,
        {
          params: this.buildParams(params),
          context: new HttpContext().set(API_TOKEN, { krathemis: true }),
        }
      ).pipe(catchError((error: HttpErrorResponse) => throwError(() => error))),
      FOLLOWERS_TTL
    );
  }

  // ─── findAllComune ────────────────────────────────────────────────────────

  findAllComune(params: FindAllUserParams, seatId: string): Observable<any> {
    const cacheKey = this.followersCacheKey('common', seatId, params.offset as number);
    return this.cacheService.wrap(
      cacheKey,
      this.http.get<any>(
        `${environment.apiKrathemis}/social-community/mutual-following/${seatId}`,
        {
          params: this.buildParams(params),
          context: new HttpContext().set(API_TOKEN, { krathemis: true }),
        }
      ).pipe(catchError((error: HttpErrorResponse) => throwError(() => error))),
      FOLLOWERS_TTL
    );
  }

  // ─── followersToHeader ────────────────────────────────────────────────────

  followersToHeader(seatId: string): Observable<any> {
    const cacheKey = `followers:header:${seatId}`;
    const mutual$ = this.http.get<any>(
      `${environment.apiKrathemis}/social-community/mutual-following/${seatId}`,
      {
        params: { limit: 1, offset: 1 },
        context: new HttpContext().set(API_TOKEN, { krathemis: true }),
      }
    );

    const followers$ = this.http.get<any>(
      `${environment.apiKrathemis}/social-community/find-all/followers/${seatId}`,
      {
        params: { limit: 3, offset: 1 },
        context: new HttpContext().set(API_TOKEN, { krathemis: true }),
      }
    );

    return this.cacheService.wrap(
      cacheKey,
      forkJoin([mutual$, followers$]).pipe(
        map(([mutual, followers]) => ({ mutual, followers }))
      ),
      FOLLOWERS_TTL
    );
  }

  // ─── Invalidación ─────────────────────────────────────────────────────────

  /**
   * Invalida toda la caché de followers/following/common de un perfil.
   * Llamar cuando el usuario sigue/deja de seguir a alguien.
   */
  invalidateFollowersCache(seatId: string): void {
    this.cacheService.invalidatePattern(seatId);
  }
}
