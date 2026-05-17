import { enableProdMode }                    from '@angular/core';
import { platformBrowserDynamic }            from '@angular/platform-browser-dynamic';

import { AppModule }                         from './app/app.module';
import { environment }                       from './environments/environment';
import { register as registerSwiperElement } from 'swiper/element/bundle';

import { defineCustomElements }              from '@ionic/pwa-elements/loader';
// Call the element loader before the bootstrapModule/bootstrapApplication call
defineCustomElements(window);
if (environment.production) {
  enableProdMode();
}

registerSwiperElement();

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
