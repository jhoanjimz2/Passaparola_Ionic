import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { TranslateModule } from '@ngx-translate/core';

import { CreatePinPageRoutingModule } from './create-pin-routing.module';
import { CreatePinPage } from './create-pin.page';
import { ComponentModule } from 'src/app/components/component.module';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { ChangePinSuccessComponent } from '../../components/change-pin-success/change-pin-success.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreatePinPageRoutingModule,
    ComponentModule,
    ReactiveFormsModule,
    TranslateModule,
    NgxMaskDirective,
    NgxMaskPipe,
  ],
  declarations: [CreatePinPage, ChangePinSuccessComponent],
})
export class CreatePinPageModule {}
