import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';

import { IonicModule } from '@ionic/angular';

import { TranslateModule } from '@ngx-translate/core';

import { ComponentModule } from 'src/app/components/component.module';
import { MapPageRoutingModule } from './map-routing.module';
import { MapPage } from './map.page';
import { BsSuggestCameraComponent } from './components/bs-create/bs-suggest-camera/bs-suggest-camera.component';
import { BsSuggestInformationStep1Component } from './components/bs-create/bs-suggest-information-step1/bs-suggest-information-step1.component';
import { BsSuggestInformationStep2Component } from './components/bs-create/bs-suggest-information-step2/bs-suggest-information-step2.component';
import { BsSuggestInformationStep3Component } from './components/bs-create/bs-suggest-information-step3/bs-suggest-information-step3.component';
import { BsSuggestInformationStep4Component } from './components/bs-create/bs-suggest-information-step4/bs-suggest-information-step4.component';
import { BsAddressOnTheMapComponent } from './components/bs-create/bs-address-on-the-map/bs-address-on-the-map.component';
import { BsTabsComponent } from './components/bs-tabs/bs-tabs.component';
import { BsListComponent } from './components/bs-list/bs-list.component';
import { BsVoteAndWinComponent } from './components/bs-vote-and-win/bs-vote-and-win.component';
import { MainPageModule } from '../main/main.module';
import { SliderCategoriesComponent } from './components/slider-categories/slider-categories.component';
import { SliderNearestStoreComponent } from './components/slider-nearest-store/slider-nearest-store.component';
import { SliderTopPrComponent } from './components/slider-top-pr/slider-top-pr.component';
import { ProfessionalsComponent } from './components/professionals/professionals.component';
import { ProfesionalsPageComponent } from './pages/profesionals/profesionals.component';
import { SeatListComponent } from './components/seat-list/seat-list.component';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { RecommendationComponent } from './components/recommendation/recommendation.component';
import { MapViewPage } from './components/map-view/map-view.page';
import { PhysicalBusinessComponent } from './pages/physical-business/physical-business.component';
import { PhysicalBusinessCardComponent } from './pages/physical-business/components/physical-business-card/physical-business-card.component';
import { SeatMarkerComponent } from './components/seat-marker/seat-marker.component';
import { EventsComponent } from './pages/events/events.component';
import { SuggestionMarkerComponent } from './components/suggestion-marker/suggestion-marker.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    MapPageRoutingModule,
    GoogleMapsModule,
    ComponentModule,
    TranslateModule,
    MainPageModule,
    PipesModule,
  ],
  declarations: [
    MapPage,
    BsSuggestCameraComponent,
    BsSuggestInformationStep1Component,
    BsSuggestInformationStep2Component,
    BsSuggestInformationStep3Component,
    BsSuggestInformationStep4Component,
    BsAddressOnTheMapComponent,
    BsTabsComponent,
    BsListComponent,
    BsVoteAndWinComponent,
    SliderCategoriesComponent,
    SliderNearestStoreComponent,
    SliderTopPrComponent,
    ProfessionalsComponent,
    ProfesionalsPageComponent,
    SeatListComponent,
    RecommendationComponent,
    MapViewPage,
    PhysicalBusinessComponent,
    PhysicalBusinessCardComponent,
    SeatMarkerComponent,
    EventsComponent,
    SuggestionMarkerComponent,
  ],
  exports: [
    MapPage,
    BsSuggestCameraComponent,
    BsSuggestInformationStep1Component,
    BsSuggestInformationStep2Component,
    BsSuggestInformationStep3Component,
    BsSuggestInformationStep4Component,
    BsAddressOnTheMapComponent,
    BsTabsComponent,
    BsListComponent,
    BsVoteAndWinComponent,
    SliderCategoriesComponent,
    SliderNearestStoreComponent,
    SliderTopPrComponent,
    ProfessionalsComponent,
    ProfesionalsPageComponent,
    SeatListComponent,
    RecommendationComponent,
    MapViewPage,
    PhysicalBusinessComponent,
    PhysicalBusinessCardComponent,
    SeatMarkerComponent,
    EventsComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MapPageModule {}
