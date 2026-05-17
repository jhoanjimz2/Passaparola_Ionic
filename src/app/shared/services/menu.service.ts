import { HttpClient, HttpErrorResponse }      from '@angular/common/http';
import { Injectable }                         from '@angular/core';
import { catchError, throwError, Observable } from 'rxjs';
import { MenuNav }                            from '../interfaces/general/menu-nav.interface';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private readonly basePath = '../../../assets/data-json';

  constructor(private http: HttpClient) {}

  private getMenu(fileName: string): Observable<MenuNav[]> {
    return this.http
      .get<MenuNav[]>(`${this.basePath}/${fileName}`)
      .pipe(
        catchError((error: HttpErrorResponse) => throwError(() => error))
      );
  }

  getMenuUser() {
    return this.getMenu('menu-user.json');
  }

  getMenuCompanyLegal() {
    return this.getMenu('menu-company-legal.json');
  }

  getMenuCompanyOperative() {
    return this.getMenu('menu-company-operative.json');
  }

  getMenuProfessionalAdministrative() {
    return this.getMenu('menu-professional-data-dministrative.json');
  }

  getMenuProfessionalPublic() {
    return this.getMenu('menu-professional-public.json');
  }
}
