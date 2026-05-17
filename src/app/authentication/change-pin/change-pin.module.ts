import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { TranslateModule } from '@ngx-translate/core';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';

import { ChangePinPageRoutingModule } from './change-pin-routing.module';
import { ChangePinPage } from './change-pin.page';
import { ComponentModule } from 'src/app/components/component.module';
import { CheckPhoneComponent } from './components/check-phone/check-phone.component';
import { CreatePinComponent } from './components/create-pin/create-pin.component';
import { ChangePinSuccessComponent } from './components/change-pin-success/change-pin-success.component';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChangePinPageRoutingModule,
    ComponentModule,
    ReactiveFormsModule,
    TranslateModule,
    NgxMaskDirective,
    NgxMaskPipe,
    NgCircleProgressModule.forRoot(),
    PipesModule,
  ],
  declarations: [
    ChangePinPage,
    CheckPhoneComponent,
    CreatePinComponent,
    ChangePinSuccessComponent,
  ],
})
export class ChangePinPageModule {}
