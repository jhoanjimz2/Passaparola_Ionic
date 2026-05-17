import {
  HttpClient,
  HttpContext,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable }                              from '@angular/core';
import { ToastrService }                           from 'ngx-toastr';

import { catchError, map, Observable, throwError } from 'rxjs';
import { v4 as uuidv4 }                            from 'uuid';

import { API_TOKEN }                               from 'src/app/core/interceptors/http.interceptor.service';
import { environment }                             from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  constructor(private http: HttpClient, private toastr: ToastrService) {}

  upload(file: Blob, path: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('path', path);
    return this.http
      .post(`${environment.apiKrathemis}/storage`, formData, {
        context: new HttpContext().set(API_TOKEN, { krathemis: true }),
      })
      .pipe(
        map((response) => {
          return response;
        })
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  uploadFile(file: Blob, path: string): Promise<string | false> {
    return new Promise((resolve, reject) => {
      let formData = new FormData();
      let xhr = new XMLHttpRequest();
      formData.append('file', file);
      formData.append('path', path);

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200 || xhr.status === 201) {
            resolve(xhr.responseText);
          } else {
            resolve(false);
          }
        }
      };

      let url = `${environment.apiKrathemis}/storage`;
      const token: string = localStorage.getItem('appPassaparola_userToken')!;
      const authorization = 'Bearer ' + token;

      xhr.open('POST', url, true);
      xhr.setRequestHeader('Authorization', authorization);
      xhr.send(formData);
    });
  }

  async uploadFiles(files: Blob[], path: string) {
    return new Promise(async (resolve, reject) => {
      const urls: string[] = [];
      await Promise.all(
        files.map(async (file) => {
          // const currentDate = new Date();
          // const time = currentDate.getTime();
          const arrayType = file.type.split('/');
          const type = arrayType[1];
          const pathFile = `${path}/${uuidv4()}.${type}`;
          const url: any = await this.uploadFile(file, pathFile);
          if (url) urls.push(url);
        })
      );
      resolve(urls);
    });
  }
}
