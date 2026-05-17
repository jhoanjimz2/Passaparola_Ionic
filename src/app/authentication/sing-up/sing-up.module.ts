import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { TranslateModule } from '@ngx-translate/core';

import { SingUpPageRoutingModule } from './sing-up-routing.module';
import { CheckPhoneComponent } from './components/check-phone/check-phone.component';
import { CreatePinComponent } from './components/create-pin/create-pin.component';
import { JoinAppComponent } from './components/join-app/join-app.component';
import { SingUpPage } from './sing-up.page';
import { ComponentModule } from 'src/app/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SingUpPageRoutingModule,
    ReactiveFormsModule,
    NgxMaskDirective,
    NgxMaskPipe,
    NgCircleProgressModule.forRoot(),
    TranslateModule,
    ComponentModule,
  ],
  declarations: [
    SingUpPage,
    CheckPhoneComponent,
    CreatePinComponent,
    JoinAppComponent,
  ],
})
export class SingUpPageModule {}
