import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateFormatMMAADirective } from './date-format-mmaa.directive';
import { DecimalValidatorDirective } from './decimal-validator.directive';

@NgModule({
  declarations: [DateFormatMMAADirective, DecimalValidatorDirective],
  imports: [CommonModule],
  exports: [DateFormatMMAADirective, DecimalValidatorDirective],
})
export class DirectivesModule {}
