import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { TranslateModule } from '@ngx-translate/core';

import { ProfileInfoPageRoutingModule } from './profile-info-routing.module';
import { ProfileInfoPage } from './profile-info.page';
import { ComponentModule } from 'src/app/components/component.module';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { ModalImgProfileComponent } from './components/modal-img-profile/modal-img-profile.component';
import { ModalInfoProfileComponent } from './components/modal-info-profile/modal-info-profile.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfileInfoPageRoutingModule,
    ComponentModule,
    PipesModule,
    TranslateModule,
    ReactiveFormsModule,
  ],
  declarations: [
    ProfileInfoPage,
    ModalImgProfileComponent,
    ModalInfoProfileComponent,
  ],
})
export class ProfileInfoPageModule {}
