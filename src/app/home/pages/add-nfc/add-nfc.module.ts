import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { TranslateModule } from '@ngx-translate/core';

import { AddNFCPageRoutingModule } from './add-nfc-routing.module';
import { AddNFCPage } from './add-nfc.page';
import { ComponentModule } from 'src/app/components/component.module';
import { MapComponent } from './components/map/map.component';
import { ScanNfcComponent } from './components/scan-nfc/scan-nfc.component';
import { ModalScanComponent } from './components/modal-scan/modal-scan.component';
import { SecurityAmountComponent } from './components/security-amount/security-amount.component';
import { CreateSuccesfullyComponent } from './components/create-succesfully/create-succesfully.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddNFCPageRoutingModule,
    ComponentModule,
    TranslateModule,
    ReactiveFormsModule,
  ],
  declarations: [
    AddNFCPage,
    MapComponent,
    ScanNfcComponent,
    ModalScanComponent,
    SecurityAmountComponent,
    CreateSuccesfullyComponent,
  ],
})
export class AddNFCPageModule {}
