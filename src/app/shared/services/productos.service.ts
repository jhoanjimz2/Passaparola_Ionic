import { HttpClient, HttpContext, HttpErrorResponse, HttpParams }                  from '@angular/common/http';
import { Injectable }                                                              from '@angular/core';
import { BehaviorSubject, catchError, forkJoin, map, Observable, tap, throwError } from 'rxjs';
import { API_TOKEN }                                                               from 'src/app/core/interceptors/http.interceptor.service';
import { environment }                                                             from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  private selectProducts$ = new BehaviorSubject<any[]>([]);
  private myProducts$     = new BehaviorSubject<any[]>([]);
  private allProducts$    = new BehaviorSubject<any[]>([]);
  private allTags$        = new BehaviorSubject<string[]>([]);

  constructor(private http: HttpClient) {}

  tags(): Observable<string[]> {
    return this.allTags$.asObservable();
  }
  allProducts(): Observable<string[]> {
    return this.allProducts$.asObservable();
  }
  myProducts(): Observable<any[]> {
    return this.myProducts$.asObservable();
  }
  selectProducts(): Observable<any[]> {
    return this.selectProducts$.asObservable();
  }
  getAllTags() {
    let httpParams = new HttpParams()
    .set('offset', 0)
    .set('limit', 100000000 )
    .set('languageCode', 'IT');
    return this.http.get<{id:string; description:string; languageCode: string}[]>(`${environment.apiKrathemis}/event/tags/find-all`,
      { context: new HttpContext().set(API_TOKEN, { krathemis: true }), params: httpParams })
    .pipe(map((response: {id:string; description:string; languageCode: string}[]) => {
      const sortedTags = response.map((t: {id:string; description:string; languageCode: string}) => t.description).sort();
      this.allTags$.next(sortedTags);
    }))
    .pipe( catchError((error: HttpErrorResponse) => { return throwError(() => error) }));
  }
  updateProducsSelect(nuevosProductos: any[]) {
    this.selectProducts$.next([...nuevosProductos]);
  }
  addProductSelect(producto: any) {
    const productosActuales = this.selectProducts$.getValue();
    const productoExistente = productosActuales.find(p => p.id === producto.id);

    if (productoExistente) {
      productoExistente.amount += 1;
      productoExistente.value = productoExistente.price * productoExistente.amount;
    } else {
      productosActuales.push({ ...producto, amount: 1, value: producto.price });
    }

    this.selectProducts$.next([...productosActuales]);
  }
  getAllProducts() {
    let httpParams = new HttpParams()
    .set('offset', 0)
    .set('limit', 10)
    .set('languageCode', 'IT');
    this.http.get<any[]>(`${environment.apiKrathemis}/product`,
      { context: new HttpContext().set(API_TOKEN, { krathemis: true }), params: httpParams })
    .pipe( catchError((error: HttpErrorResponse) => { return throwError(() => error) }))
    .subscribe({
      next: (response: any) => this.allProducts$.next(response)
    })
  }
  getMyProducts() {
    let httpParams = new HttpParams()
    .set('offset', 0)
    .set('limit', 10)
    .set('languageCode', 'IT');
    return this.http.get<any[]>(`${environment.apiKrathemis}/product/find-all/by-user`,
      { context: new HttpContext().set(API_TOKEN, { krathemis: true }), params: httpParams })
    .pipe(map((response: any[]) => {
      this.myProducts$.next(response);
    }))
    .pipe( catchError((error: HttpErrorResponse) => { return throwError(() => error) }));
  }

  createProducts(producto: any) {
    return this.http.post<any[]>(`${environment.apiKrathemis}/product`, {...producto}, {
      context: new HttpContext().set(API_TOKEN, { krathemis: true })
    }).pipe(
      tap(() => forkJoin([
        this.getMyProducts(),
      ]).subscribe()),
      catchError((error: HttpErrorResponse) => throwError(() => error))
    );
  }


}
