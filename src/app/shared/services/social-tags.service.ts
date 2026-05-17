import { HttpClient, HttpContext, HttpParams }          from '@angular/common/http';
import { Injectable }                                   from '@angular/core';
import { BehaviorSubject, map, Observable }             from 'rxjs';
import { API_TOKEN }                                    from 'src/app/core/interceptors/http.interceptor.service';
import { environment }                                  from 'src/environments/environment';
import { FindAllUserParams }                            from '../interfaces/social/social-post';

@Injectable({
  providedIn: 'root'
})
export class SocialTagsService {

  private categories$ = new BehaviorSubject<any[]>([]);

  constructor(private http: HttpClient) {}

  getCategoriesTags(): Observable<any[]> {
    return this.categories$.asObservable();
  }

  categoriesTags(params: FindAllUserParams) {
    let httpParams = new HttpParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        httpParams = httpParams.set(key, value.toString());
      }
    });
    this.http.get<any>(
      `${environment.apiKrathemis}/social-community/category/find-all`,
      {
        params: httpParams,
        context: new HttpContext().set(API_TOKEN, { krathemis: true })
      }
    ).subscribe((response) => {
      this.categories$.next(
        response.data.map((item: any) => ({
          description: item.description,
          categoryId: item.id,
          topics: item.topics || [],
          languageCode: 'IT'
        }))
      );
    });
  }

  tags(params: FindAllUserParams) {
    let httpParams = new HttpParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        httpParams = httpParams.set(key, value.toString());
      }
    });

    return this.http.get<any>(`${environment.apiKrathemis}/social-community/category/find-all/subcategories`,
      {
        params: httpParams,
        context: new HttpContext().set(API_TOKEN, { krathemis: true, showSpinner: false })
      }
    ).pipe(
      map(response => response.data.map((item: any) => ({
        description: item.description,
        id: item.id
      })))
    );
  }
}
