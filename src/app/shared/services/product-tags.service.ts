import { HttpClient, HttpContext }     from '@angular/common/http';
import { Injectable }                  from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { API_TOKEN }                   from 'src/app/core/interceptors/http.interceptor.service';
import { environment }                 from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductTagsService {
  private allProducts$       = new BehaviorSubject<any[]>([]);
  private categoriesProduct$ = new BehaviorSubject<any[]>([]);

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<any[]> {
    return this.allProducts$.asObservable();
  }
  getAllCategories(): Observable<any[]> {
    return this.categoriesProduct$.asObservable();
  }
  categoriesProducts() {
    this.http.get<any>(
      `${environment.apiKrathemis}/product-category?limit=100000&offset=1`,
      { context: new HttpContext().set(API_TOKEN, { krathemis: true }) }
    ).subscribe((response) => {
      this.categoriesProduct$.next(response.data);
    });
  }
  allProducts() {
    this.http.get<any>(
      `${environment.apiKrathemis}/product?limit=100000&offset=1`,
      { context: new HttpContext().set(API_TOKEN, { krathemis: true }) }
    ).subscribe((response) => {
      this.allProducts$.next(response.data);
    });
  }
}
