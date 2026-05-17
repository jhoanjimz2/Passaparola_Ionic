import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PromotionalMatPageRoutingModule } from './promotional-mat-routing.module';

import { PromotionalMatPage } from './promotional-mat.page';
import { ComponentModule } from 'src/app/components/component.module';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { NgxQrcodeStylingModule } from 'ngx-qrcode-styling';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PromotionalMatPageRoutingModule,
    ComponentModule,
    TranslateModule,
    PipesModule,
    NgxQrcodeStylingModule,
  ],
  declarations: [PromotionalMatPage],
})
export class PromotionalMatPageModule {}
