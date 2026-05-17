import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TranslateModule } from '@ngx-translate/core';

import { RechargesPageRoutingModule } from './recharges-routing.module';

import { RechargesPage } from './recharges.page';
import { ComponentModule } from 'src/app/components/component.module';
import { TpvComponent } from './components/tpv/tpv.component';
import { PaymentResumeComponent } from './components/payment-resume/payment-resume.component';
import { PaymentConfirmComponent } from './components/payment-confirm/payment-confirm.component';
import { PaymentSuccessComponent } from './components/payment-success/payment-success.component';
import { CompensationComponent } from './components/compensation/compensation.component';
import { IncreaseLimitComponent } from './components/increase-limit/increase-limit.component';
import { FormattNumberPipe } from 'src/app/shared/pipes/formatt-number.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RechargesPageRoutingModule,
    ComponentModule,
    TranslateModule,
    FormattNumberPipe,
  ],
  declarations: [
    RechargesPage,
    TpvComponent,
    PaymentResumeComponent,
    PaymentConfirmComponent,
    PaymentSuccessComponent,
    CompensationComponent,
    IncreaseLimitComponent,
  ],
})
export class RechargesPageModule {}
