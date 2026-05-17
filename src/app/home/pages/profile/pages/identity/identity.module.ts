import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { TranslateModule } from '@ngx-translate/core';

import { IdentityPageRoutingModule } from './identity-routing.module';
import { IdentityPage } from './identity.page';
import { ComponentModule } from 'src/app/components/component.module';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IdentityPageRoutingModule,
    ComponentModule,
    ReactiveFormsModule,
    TranslateModule,
    PipesModule,
  ],
  declarations: [IdentityPage],
})
export class IdentityPageModule {}
