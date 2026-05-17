import { Injectable }                                                          from '@angular/core';
import { SummaryCommunity }                                                    from '../interfaces/community/summary-friends.interface';
import { environment }                                                         from 'src/environments/environment';
import { HttpClient, HttpContext, HttpErrorResponse }                          from '@angular/common/http';
import { API_TOKEN }                                                           from 'src/app/core/interceptors/http.interceptor.service';
import { BehaviorSubject, catchError, map, Observable, switchMap, throwError } from 'rxjs';
import { User }                                                                from '../interfaces/user/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserTagsService {

  private usersMergedData$ = new BehaviorSubject<any[]>([]);

  constructor(private http: HttpClient) {}

  getUsersMergedData(): Observable<any[]> {
    return this.usersMergedData$.asObservable();
  }
  private setUsersMergedData(data: any){
    this.usersMergedData$.next(data);
  }

  loadUsersMergedData(userId: string, month: number, year: number) {
    return this.findSummaryCommunityByCountry(userId, month, year).pipe(
      switchMap((summaryCommunity) => {
        const usersIds = summaryCommunity.flatMap((c) =>
          c.myFriends.map((f) => f.userId)
        );

        return this.getUsers(usersIds).pipe(
          map((users) => ({ summaryCommunity, users }))
        );
      }),
      map(({ summaryCommunity, users }) => {
        const usersMap = new Map(users.map((u) => [u.userID, u]));
        const usersMergedData = summaryCommunity.flatMap((community) =>
          community.myFriends
            .map((friend) => {
              const user = usersMap.get(friend.userId);
              if (!user?.profile?.name) return null;
              return {
                userID: user.id,
                userName: user.profile.name,
                userImg: user.profile?.profilePictureUrlFile || 'https://placehold.co/40x40?text=profile',
                userSelected: false,
                userLevel: friend.nextWorldRewardPoints?.level
              };
            })
            .filter((user) => user !== null)
        );

        this.setUsersMergedData(usersMergedData);
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  private findSummaryCommunityByCountry(userId: string, month: number, year: number) {
    return this.http
      .get<SummaryCommunity[]>(
        `${environment.apiUnika}/community/summary-community-by-country/${userId}/${month}/${year}`,
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
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  private getUsers(userIds: string[]) {
    return this.http
      .post<User[]>(
        `${environment.apiKrathemis}/user/users-by-userIds`,
        userIds,
        {
          context: new HttpContext().set(API_TOKEN, { krathemis: true }),
        }
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }
}
