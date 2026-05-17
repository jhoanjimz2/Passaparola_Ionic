import { CUSTOM_ELEMENTS_SCHEMA, NgModule, isDevMode }   from '@angular/core';
import { BrowserModule }                                 from '@angular/platform-browser';
import { RouteReuseStrategy }                            from '@angular/router';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpClientJsonpModule,
  HttpClientModule,
} from '@angular/common/http';
import { IonicModule, IonicRouteStrategy }               from '@ionic/angular';
import { BrowserAnimationsModule }                       from '@angular/platform-browser/animations';
import { DatePipe, registerLocaleData }                  from '@angular/common';
import localeIt                                          from '@angular/common/locales/it';
// import { ServiceWorkerModule }                           from '@angular/service-worker';
import { GoogleMapsModule }                              from '@angular/google-maps';
import { MAT_DATE_LOCALE }                               from '@angular/material/core';

import { TranslateLoader, TranslateModule }              from '@ngx-translate/core';
import { TranslateHttpLoader }                           from '@ngx-translate/http-loader';
import { initializeApp }                                 from 'firebase/app';
import { getAnalytics }                                  from 'firebase/analytics';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { ToastrModule }                                  from 'ngx-toastr';
import { NgxSpinnerModule }                              from 'ngx-spinner';

import { AppComponent }                                  from './app.component';
import { AppRoutingModule }                              from './app-routing.module';
import { environment }                                   from 'src/environments/environment';
import { HttpInterceptorService }                        from './core/interceptors/http.interceptor.service';
import { MaterialModule }                                from './shared/material/material.module';
import { NgCircleProgressModule }                        from 'ng-circle-progress';

registerLocaleData(localeIt, 'it');

const app = initializeApp(environment.firebaseConfig);
const analytics = getAnalytics(app);

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    HttpClientJsonpModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    // ServiceWorkerModule.register('ngsw-worker.js', {
    //   enabled: !isDevMode(),
    //   // Register the ServiceWorker as soon as the application is stable
    //   // or after 30 seconds (whichever comes first).
    //   registrationStrategy: 'registerWhenStable:30000',
    // }),
    NgCircleProgressModule.forRoot({
      outerStrokeWidth: 5,
      innerStrokeWidth: 0,
      outerStrokeColor: "#FF3D00",
      innerStrokeColor: "#FF3D00",
      animationDuration: 1,
    }),
    NgxMaskDirective,
    NgxMaskPipe,
    ToastrModule.forRoot({
      timeOut: 4000,
      positionClass: 'toast-bottom-center',
      preventDuplicates: true,
    }),
    NgxSpinnerModule,
    GoogleMapsModule,
    MaterialModule,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true,
    },
    provideNgxMask(),
    DatePipe,
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
