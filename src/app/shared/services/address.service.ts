import { HttpClient, HttpContext, HttpErrorResponse }               from '@angular/common/http';
import { Injectable }                                               from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { API_TOKEN }                                                from 'src/app/core/interceptors/http.interceptor.service';
import { environment }                                              from 'src/environments/environment';
import { Address, CreateAddressRequest }                            from '../interfaces/address/address.interface';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  private myAddresses$ = new BehaviorSubject<Address[]>([]);

  constructor(private http: HttpClient) {}

  myAddresses(): Observable<Address[]> {
    return this.myAddresses$.asObservable();
  }

  getAllMyAddress(): Observable<Address[]> {
    return this.http.get<Address[]>(
      `${environment.apiKrathemis}/profile/addresses/all`,
      {
        context: new HttpContext().set(API_TOKEN, { krathemis: true }),
      }
    )
    .pipe(tap((addresses: Address[]) => this.myAddresses$.next(addresses)))
    .pipe(catchError((error: HttpErrorResponse) => throwError(() => error)));
  }

  getAddressById(id: string): Observable<Address> {
    return this.http.get<Address>(
      `${environment.apiKrathemis}/profile/address/${id}`,
      {
        context: new HttpContext().set(API_TOKEN, { krathemis: true }),
      }
    )
    .pipe(catchError((error: HttpErrorResponse) => throwError(() => error)));
  }


  createAddress(createCategory: CreateAddressRequest) {
    return this.http.post<any>(
      `${environment.apiKrathemis}/profile/address`, createCategory,
      {
        context: new HttpContext().set(API_TOKEN, { krathemis: true })
      }
    );
  }

  update(createCategory: CreateAddressRequest, id: string) {
    return this.http.patch<any>(
      `${environment.apiKrathemis}/profile/address/${id}`, createCategory,
      {
        context: new HttpContext().set(API_TOKEN, { krathemis: true })
      }
    );
  }

  delete(id: string) {
    return this.http.delete<any>(
      `${environment.apiKrathemis}/profile/address/${id}`,
      {
        context: new HttpContext().set(API_TOKEN, { krathemis: true })
      }
    );
  }


}
