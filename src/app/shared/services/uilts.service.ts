import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  constructor() {}

  sortByField(array: any, field: any, asc = true) {
    return array.sort((a: any, b: any) => {
      if (a[field] < b[field]) {
        return asc ? -1 : 1;
      }
      if (a[field] > b[field]) {
        return asc ? 1 : -1;
      }
      return 0;
    });
  }
}
