import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ShowSpinnerService {
  private showSpinner: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    true
  );
  constructor() {}

  showSpinnerWatch(): Observable<any> {
    return this.showSpinner.asObservable();
  }

  showSpinnerWatchSet(value: boolean) {
    this.showSpinner.next(value);
  }
}
