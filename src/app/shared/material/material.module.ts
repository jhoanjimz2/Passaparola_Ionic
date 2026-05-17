import { NgModule }                                                   from '@angular/core';

import { MatCardModule }                                              from '@angular/material/card';
import { MatDatepickerModule }                                        from '@angular/material/datepicker';
import { MatNativeDateModule }                                        from '@angular/material/core';
import { MatFormFieldModule }                                         from '@angular/material/form-field';
import { MatInputModule }                                             from '@angular/material/input';


@NgModule({
  exports: [
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,

    MatFormFieldModule,
    MatInputModule
  ]
})
export class MaterialModule { }
