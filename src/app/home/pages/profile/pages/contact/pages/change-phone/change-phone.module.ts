import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { TranslateModule } from '@ngx-translate/core';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { NgCircleProgressModule } from 'ng-circle-progress';

import { ChangePhonePageRoutingModule } from './change-phone-routing.module';
import { ChangePhonePage } from './change-phone.page';
import { ComponentModule } from 'src/app/components/component.module';
import { ChangePhoneSuccessComponent } from '../../components/change-phone-success/change-phone-success.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChangePhonePageRoutingModule,
    ComponentModule,
    TranslateModule,
    ReactiveFormsModule,
    NgCircleProgressModule.forRoot(),
    NgxMaskDirective,
    NgxMaskPipe,
  ],
  declarations: [ChangePhonePage, ChangePhoneSuccessComponent],
})
export class ChangePhonePageModule {}
