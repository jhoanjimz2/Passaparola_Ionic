import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Company }                                from 'src/app/shared/interfaces/company/company.interface';

@Component({
  selector: 'app-select-login-professionals',
  templateUrl: './select-login-professionals.component.html',
  styleUrls: ['./select-login-professionals.component.scss'],
})
export class SelectLoginProfessionalsComponent {
  @Output() selectProfessionalAccount: EventEmitter<any> = new EventEmitter<any>();
  @Input() profesional: Company = {} as Company;

  select(seat: any, type: any) {
    this.selectProfessionalAccount.emit({
      ...seat, type
    })
  }

}
