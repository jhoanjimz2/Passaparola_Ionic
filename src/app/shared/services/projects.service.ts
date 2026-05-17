import { HttpClient, HttpContext }     from '@angular/common/http';
import { Injectable }                  from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { API_TOKEN }                   from 'src/app/core/interceptors/http.interceptor.service';
import { environment }                 from 'src/environments/environment';
import { Project, ResponseProject }    from '../interfaces/projects/project';
import { CategoryProject }             from '../interfaces/projects/categories';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  private allProjects$       = new BehaviorSubject<Project[]>([]);
  private categoriesProject$ = new BehaviorSubject<CategoryProject[]>([]);

  constructor(private http: HttpClient) {}

  getAllProjects(): Observable<Project[]> {
    return this.allProjects$.asObservable();
  }
  getAllCategories(): Observable<CategoryProject[]> {
    return this.categoriesProject$.asObservable();
  }

  categoriesProyects() {
    this.http.get<CategoryProject[]>(
      `${environment.apiKrathemis}/project/category/findAll?limit=100000&offset=1`,
      { context: new HttpContext().set(API_TOKEN, { krathemis: true }) }
    ).subscribe((response) => {
      this.categoriesProject$.next(response);
    });
  }
  allProjects() {
    this.http.get<ResponseProject>(
      `${environment.apiKrathemis}/project/stages/findAll?limit=100000&offset=1`,
      { context: new HttpContext().set(API_TOKEN, { krathemis: true }) }
    ).subscribe((response) => {
      this.allProjects$.next(response.data);
    });
  }
}
