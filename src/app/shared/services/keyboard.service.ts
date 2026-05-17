import { Injectable }      from '@angular/core';
import { Keyboard }        from '@capacitor/keyboard';
import { BehaviorSubject } from 'rxjs';
import { Capacitor }       from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class KeyboardService {
  private isKeyboardOpenSubject = new BehaviorSubject<boolean>(false);
  public isKeyboardOpen$ = this.isKeyboardOpenSubject.asObservable();
  private listeners: (() => void)[] = [];

  constructor() {
    if (Capacitor.isNativePlatform()) {
      this.initializeListeners();
    }
  }

  private async initializeListeners() {
    const showListener = await Keyboard.addListener('keyboardDidShow', () => {
      this.isKeyboardOpenSubject.next(true);
    });

    const hideListener = await Keyboard.addListener('keyboardDidHide', () => {
      this.isKeyboardOpenSubject.next(false);
    });

    this.listeners.push(() => showListener.remove(), () => hideListener.remove());
  }

  dispose() {
    this.listeners.forEach(removeFn => removeFn());
    this.listeners = [];
  }
}
