import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { TranslateModule } from '@ngx-translate/core';

import { ContactPageRoutingModule } from './contact-routing.module';
import { ContactPage } from './contact.page';
import { ComponentModule } from 'src/app/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ContactPageRoutingModule,
    ComponentModule,
    TranslateModule,
    ReactiveFormsModule,
  ],
  declarations: [ContactPage],
})
export class ContactPageModule {}
