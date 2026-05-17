import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MainPageRoutingModule } from './main-routing.module';

import { OnboardingEventsComponent } from './components/onboarding-events/onboarding-events.component';
import { MainPage } from './main.page';
import { WalletComponent } from './components/wallet/wallet.component';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentModule } from 'src/app/components/component.module';
import { CommunityComponent } from './components/community/community.component';
import { InviteComponent } from './components/invite/invite.component';
import { SocialComponent } from './components/social/social.component';
import { StoresComponent } from './components/stores/stores.component';
import { OnlineStoresComponent } from './components/online-stores/online-stores.component';
import { MallComponent } from './components/mall/mall.component';
import { LocalEconomyComponent } from './components/local-economy/local-economy.component';
import { MapComponent } from './components/map/map.component';
import { PublicityComponent } from './components/publicity/publicity.component';
import { ProductsComponent } from './components/products/products.component';
import { SliderNearestStoreComponent } from './components/slider-nearest-store/slider-nearest-store.component';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { RecommendationComponent } from './components/recommendation/recommendation.component';
import { SliderCategoriesComponent } from './components/slider-categories/slider-categories.component';
import { ModalInfoRestaurantComponent } from './components/modal-info-restaurant/modal-info-restaurant.component';
import { FormDoctorsComponent } from './components/form-doctors/form-doctors.component';
import { InviteCardComponent } from './components/invite-card/invite-card.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { FormattNumberPipe } from 'src/app/shared/pipes';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MainPageRoutingModule,
    TranslateModule,
    ComponentModule,
    PipesModule,
    ReactiveFormsModule,
    FormattNumberPipe,
  ],
  declarations: [
    MainPage,
    WalletComponent,
    CommunityComponent,
    InviteComponent,
    SocialComponent,
    StoresComponent,
    OnlineStoresComponent,
    MallComponent,
    LocalEconomyComponent,
    MapComponent,
    PublicityComponent,
    ProductsComponent,
    SliderNearestStoreComponent,
    RecommendationComponent,
    SliderCategoriesComponent,
    ModalInfoRestaurantComponent,
    FormDoctorsComponent,
    InviteCardComponent,
    CalendarComponent,
    OnboardingEventsComponent,
  ],
  exports: [MapComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MainPageModule {}
