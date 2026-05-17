import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { TranslateModule } from '@ngx-translate/core';
import { NgxQrcodeStylingModule } from 'ngx-qrcode-styling';

import { WalletPageRoutingModule } from './wallet-routing.module';
import { WalletPage } from './wallet.page';
import { ActionsComponent } from './components/actions/actions.component';
import { ContactsComponent } from './components/contacts/contacts.component';
import { ComponentModule } from 'src/app/components/component.module';
import { ContactPipe, FormattNumberPipe } from 'src/app/shared/pipes';
import { WalletIDComponent } from './components/wallet-id/wallet-id.component';
import { TransferComponent } from './components/transfer/transfer.component';
import { TransferSuccessfullyComponent } from './components/transfer-successfully/transfer-successfully.component';
import { MovementsComponent } from './components/movements/movements.component';
import { TransfernErrorComponent } from './components/transfern-error/transfern-error.component';
import { ReceiveModalComponent } from './components/receive-modal/receive-modal.component';
import { GenerateQrCodeComponent } from './components/generate-qr-code/generate-qr-code.component';
import { WithdrawComponent } from './components/withdraw/withdraw.component';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { AcceptAtmSuccessfullyComponent } from './components/accept-atm-successfully/accept-atm-successfully.component';
import { QrCodeComponent } from './components/qr-code/qr-code.component';
import { MyWalletsComponent } from './components/my-wallets/my-wallets.component';
import { PassaparolaCashComponent } from './components/passaparola-cash/passaparola-cash.component';
import { MapComponent } from './components/map/map.component';
import { ConfirmWithdrawComponent } from './components/confirm-withdraw/confirm-withdraw.component';
import { SuccessfullyWithdrawComponent } from './components/successfully-withdraw/successfully-withdraw.component';
import { ErrorWithdrawComponent } from './components/error-withdraw/error-withdraw.component';
import { MovCashBackComponent } from './components/mov-cash-back/mov-cash-back.component';
import { WithdrawRewardsComponent } from './components/withdraw-rewards/withdraw-rewards.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WalletPageRoutingModule,
    TranslateModule,
    ComponentModule,
    ReactiveFormsModule,
    NgxQrcodeStylingModule,
    NgxMaskDirective,
    NgxMaskPipe,
    FormattNumberPipe,
  ],
  declarations: [
    WalletPage,
    ActionsComponent,
    ContactsComponent,
    WalletIDComponent,
    ContactPipe,
    TransferComponent,
    TransferSuccessfullyComponent,
    MovementsComponent,
    TransfernErrorComponent,
    ReceiveModalComponent,
    GenerateQrCodeComponent,
    WithdrawComponent,
    AcceptAtmSuccessfullyComponent,
    QrCodeComponent,
    MyWalletsComponent,
    PassaparolaCashComponent,
    MapComponent,
    ConfirmWithdrawComponent,
    SuccessfullyWithdrawComponent,
    ErrorWithdrawComponent,
    MovCashBackComponent,
    WithdrawRewardsComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class WalletPageModule {}
