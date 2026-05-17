import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CheckCodePageRoutingModule } from './check-code-routing.module';

import { CheckCodePage } from './check-code.page';
import { ComponentModule } from 'src/app/components/component.module';
import { TranslateModule } from '@ngx-translate/core';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CheckCodePageRoutingModule,
    ComponentModule,
    TranslateModule,
    ReactiveFormsModule,
    NgCircleProgressModule.forRoot(),
    NgxMaskDirective,
    NgxMaskPipe,
  ],
  declarations: [CheckCodePage],
})
export class CheckCodePageModule {}
