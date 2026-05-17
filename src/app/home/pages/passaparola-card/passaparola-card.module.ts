import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { TranslateModule } from '@ngx-translate/core';

import { PassaparolaCardPageRoutingModule } from './passaparola-card-routing.module';
import { PassaparolaCardPage } from './passaparola-card.page';
import { ComponentModule } from 'src/app/components/component.module';
import { CheckPhoneComponent } from './components/check-phone/check-phone.component';
import { ConfirmationComponent } from './components/confirmation/confirmation.component';
import { AssingSuccessfulComponent } from './components/assing-successful/assing-successful.component';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { NgCircleProgressModule } from 'ng-circle-progress';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PassaparolaCardPageRoutingModule,
    ComponentModule,
    TranslateModule,
    NgxMaskDirective,
    NgxMaskPipe,
    NgCircleProgressModule.forRoot(),
    ReactiveFormsModule,
  ],
  declarations: [
    PassaparolaCardPage,
    CheckPhoneComponent,
    ConfirmationComponent,
    AssingSuccessfulComponent,
  ],
})
export class PassaparolaCardPageModule {}
