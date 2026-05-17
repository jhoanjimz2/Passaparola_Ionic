import { Injectable } from '@angular/core';
import { Router, ActivationEnd, NavigationEnd } from '@angular/router';
import { Title, Meta, MetaDefinition } from '@angular/platform-browser';

import { filter } from 'rxjs/operators';
import { map } from 'rxjs';
// import { GoogleAnalyticsService } from './google-analytics.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class RouterService {
  currentTitle = '';

  constructor(
    private router: Router,
    private title: Title,
    private meta: Meta,
    // private googleAnalyticsService: GoogleAnalyticsService,
    private translate: TranslateService
  ) {}

  async getUrlsRouter() {
    localStorage.setItem('appPassaparola_currentUrl', this.router.url);
    this.router.events.subscribe(async (event) => {
      if (event instanceof NavigationEnd) {
        const currentUrl = localStorage.getItem('appPassaparola_currentUrl');
        if (currentUrl !== '/')
          localStorage.setItem('appPassaparola_previousUrl', currentUrl!);

        localStorage.setItem('appPassaparola_currentUrl', event.url);
        this.getNavPage(event.url);
      }
    });
  }

  getDataRouter() {
    this.dataRouter().subscribe((data: any) => {
      if (!data) return;
      if (data.title) {
        const title = this.translate.instant(data.title);
        const title2 = data.title2
          ? ' ' + this.translate.instant(data.title2)
          : '';

        if (`${title}${title2}` !== 'HOME')
          this.setPageTitle(`${title}${title2}`);
      }
    });
  }

  dataRouter() {
    return this.router.events.pipe(
      filter((event: any) => event instanceof ActivationEnd),
      filter((event: ActivationEnd) => event.snapshot.firstChild === null),
      map((event: ActivationEnd) => event.snapshot.data)
    );
  }

  setPageTitle(title: string) {
    const titlePage =
      title.toLowerCase()[0].toUpperCase() + title.toLowerCase().substring(1);
    this.title.setTitle(`Benidorm App - ${titlePage}`);
    const metaTag: MetaDefinition = {
      name: 'description',
      content: `${titlePage}`,
    };
    this.meta.updateTag(metaTag);
    // this.googleAnalyticsService.setEvent('page_view', {});
  }

  getNavPage(url: string) {
    let data = { PAGINA: url };
    if (url.includes('?')) {
      const arrayUrl = url.split('?');
      data = { PAGINA: arrayUrl[0] };
    }
    // this.googleAnalyticsService.setEvent('NAVEGACION_PAGINA', data);
  }
}
