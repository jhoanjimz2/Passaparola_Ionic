import { Component, Input }     from '@angular/core';
import { ToastrService }        from 'ngx-toastr';
import { IonicModule }          from '@ionic/angular';
import { CommonModule }         from '@angular/common';
import { Professional }         from 'src/app/shared/interfaces/professionals/professionals';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  imports: [
    IonicModule,
    CommonModule
  ],
  standalone: true
})
export class ContactComponent {
  @Input() professional: Professional = {} as Professional;

  constructor(
    private toastr: ToastrService,
  ) {}

  copyToClipboard(value: string): void {
    if (!value) return;
    navigator.clipboard.writeText(value).then(() => {
      this.toastr.success('Copiato');
    }).catch(() => {
      this.toastr.error('Errore');
    });
  }
}
