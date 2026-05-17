import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { NgxQrcodeStylingModule } from 'ngx-qrcode-styling';

import { TPVPageRoutingModule } from './payment-routing.module';

import { PaymentPage } from './payment.page';
import { AmountWithoutRewardsComponent } from './components/business/amount-without-rewards/amount-without-rewards.component';
import { PaymentResumeComponent } from './components/business/payment-resume/payment-resume.component';
import { PaymentConfirmComponent } from './components/business/payment-confirm/payment-confirm.component';
import { PaymentNotificationComponent } from './components/client/payment-notification/payment-notification.component';
import { ComponentModule } from 'src/app/components/component.module';
import { PaymentQrComponent } from './components/business/payment-qr/payment-qr.component';
import { ClientPaymentResumeComponent } from './components/client/client-payment-resume/client-payment-resume.component';
import { ClientPaymentSuccessComponent } from './components/client/client-payment-success/client-payment-success.component';
import { ClientPaymentDeniedComponent } from './components/client/client-payment-denied/client-payment-denied.component';
import { PaymentSuccessNotificationComponent } from './components/business/payment-success-notification/payment-success-notification.component';
import { PaymentCancelNotificationComponent } from './components/business/payment-cancel-notification/payment-cancel-notification.component';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { TranslateModule } from '@ngx-translate/core';
import { FormattNumberPipe } from 'src/app/shared/pipes';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TPVPageRoutingModule,
    ComponentModule,
    NgxQrcodeStylingModule,
    PipesModule,
    TranslateModule,
    FormattNumberPipe,
  ],
  declarations: [
    AmountWithoutRewardsComponent,
    PaymentConfirmComponent,
    PaymentNotificationComponent,
    PaymentPage,
    PaymentQrComponent,
    PaymentResumeComponent,
    ClientPaymentResumeComponent,
    ClientPaymentSuccessComponent,
    ClientPaymentDeniedComponent,
    PaymentSuccessNotificationComponent,
    PaymentCancelNotificationComponent,
  ],
})
export class TPVPageModule {}
