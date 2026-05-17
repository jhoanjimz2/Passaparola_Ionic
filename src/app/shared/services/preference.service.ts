import { HttpClient, HttpContext, HttpParams }          from '@angular/common/http';
import { Injectable }                                   from '@angular/core';
import { BehaviorSubject, map, Observable }             from 'rxjs';
import { API_TOKEN }                                    from 'src/app/core/interceptors/http.interceptor.service';
import { environment }                                  from 'src/environments/environment';
import { FindAllUserParams }                            from '../interfaces/social/social-post';
import { Profile }                                      from '../interfaces/user/profile.interface';

@Injectable({
  providedIn: 'root'
})
export class PreferenceService {

  private categories$ = new BehaviorSubject<any[]>([]);
  private categoriesWithChildren$ = new BehaviorSubject<any[]>([]);

  constructor(private http: HttpClient) {}

  private get idUserOrCompany () {
    const user = this.getLocalStorageItem('appPassaparola_user');
    const seat = user?.rol === 'company'
      ? this.getLocalStorageItem('appPassaparola_loginSeat')
      : user.profile;
    return seat?.id;
  }

  private getLocalStorageItem(key: string): any {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }

  getCategoriesTags(): Observable<any[]> {
    return this.categories$.asObservable();
  }

  getCategoriesWithChildrenTags(): Observable<any[]> {
    return this.categoriesWithChildren$.asObservable();
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

  categoriesTagsWithChildren(params: FindAllUserParams) {
    let httpParams = new HttpParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        httpParams = httpParams.set(key, value.toString());
      }
    });
    this.http.get<any>(
      `${environment.apiKrathemis}/social-community/category/find-all/with-children`,
      {
        params: httpParams,
        context: new HttpContext().set(API_TOKEN, { krathemis: true })
      }
    ).subscribe((response) => {
      this.categoriesWithChildren$.next(
        response.map((item: any) => ({
          description: item.description,
          socialCommunityCategoryTranslation: item.socialCommunityCategoryTranslation,
          name: item.name,
          urlImage: item.urlImage,
          categoryId: item.id,
          children: item.children || []
        }))
      );
    });
  }

  createCategory(createCategory: any) {
    return this.http.post<any>(
      `${environment.apiKrathemis}/social-community/create-category`,
      {
        ...createCategory
      },
      {
        context: new HttpContext().set(API_TOKEN, { krathemis: true, showSpinner: true })
      }
    );
  }

  pushCategory(data: {
    socialCommunityOficialPreferences: Array<{id: string, type: string}>,
    socialCommunityUserPreferences: Array<{id: string, type: string}>
  }) {
    return this.http.patch<any>(
      `${environment.apiKrathemis}/profile/${this.idUserOrCompany}`,
      data,
      {
        context: new HttpContext().set(API_TOKEN, { krathemis: true })
      }
    );
  }

  getProfileById(): Observable<Profile> {
    return this.http.get<Profile>(
      `${environment.apiKrathemis}/profile/${this.idUserOrCompany}`,
      {
        context: new HttpContext().set(API_TOKEN, { krathemis: true })
      }
    );
  }
}
