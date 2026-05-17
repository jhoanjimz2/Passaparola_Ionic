import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { TranslateModule } from '@ngx-translate/core';

import { LandingPageRoutingModule } from './landing-routing.module';
import { LandingPage } from './landing.page';
import { InformationComponent } from './components/information/information.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LandingPageRoutingModule,
    TranslateModule,
  ],
  declarations: [LandingPage, InformationComponent],
})
export class LandingPageModule {}
