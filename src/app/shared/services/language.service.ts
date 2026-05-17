import { DOCUMENT } from '@angular/common';
import { Injectable, Inject } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private languageCode: string = environment.language.default;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private translate: TranslateService
  ) {}

  changeLang(lang: 'es' | 'it' | 'en') {
    localStorage.setItem('language', lang);
    this.languageCode = lang;
    this.setLanguage();
  }

  currentLang(): string {
    return this.languageCode;
  }

  async setLanguage(): Promise<any> {
    return new Promise(async (resolve) => {
      this.translate.addLangs(environment.language.list);
      let lang = this.getLang();
      this.document.documentElement.lang = lang;
      await firstValueFrom(this.translate.use(lang));
      resolve(true);
    });
  }

  private getLang(): string {
    let lang = localStorage.getItem('language') as string;
    if (lang) {
      this.languageCode = lang;
      return lang;
    } else {
      this.languageCode = 'it';
      localStorage.setItem('language', this.languageCode);
      return this.languageCode;
    }
  }
}
