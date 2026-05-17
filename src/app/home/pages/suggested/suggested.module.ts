import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { TranslateModule } from '@ngx-translate/core';

import { SuggestedPage } from './suggested.page';
import { SuggestedPageRoutingModule } from './suggested-routing.module';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SuggestedPageRoutingModule,
    TranslateModule,
    PipesModule,
  ],
  declarations: [SuggestedPage],
})
export class SuggestedPageModule {}
