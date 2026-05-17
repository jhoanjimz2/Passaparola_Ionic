import { Component, Input }             from '@angular/core';
import { CommonModule }                 from '@angular/common';
import { FormsModule }                  from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { Professional }                 from 'src/app/shared/interfaces/professionals/professionals';
import { EmailCodeService }             from 'src/app/shared/services';
import { ToastrService }                from 'ngx-toastr';

@Component({
  selector: 'app-send-message',
  templateUrl: './send-message.component.html',
  styleUrls: ['./send-message.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class SendMessageComponent {
  @Input() professional!: Professional;

  requestTitle: string = '';
  requestDescription: string = '';
  maxDescriptionLength: number = 500;

  constructor(
    private modalCtrl: ModalController,
    private emailCodeService: EmailCodeService,
    private toastr: ToastrService
  ) {}

  dismiss() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  async send() {
    if (!this.requestTitle.trim() || !this.requestDescription.trim()) {
      return;
    }

    const professionalEmail = this.professional.email;
    if (!professionalEmail) {
      return;
    }

    const professionalName = this.professional.profile?.name || 'Professionista';
    const subject = `Nuova richiesta: ${this.requestTitle}`;

    this.emailCodeService.sendEmailToProfessional(
      professionalEmail,
      professionalName,
      subject,
      this.requestTitle,
      this.requestDescription
    ).subscribe({
      next: () => {
        this.modalCtrl.dismiss({
          title: this.requestTitle,
          description: this.requestDescription,
          sent: true
        }, 'confirm');
        this.toastr.success('Richiesta inviata con successo!');
      },
      error: (error) => {
        console.error('Error sending email:', error);
      }
    });
  }

  get remainingCharacters(): number {
    return this.maxDescriptionLength - this.requestDescription.length;
  }

  get isFormValid(): boolean {
    return this.requestTitle.trim().length > 0 &&
           this.requestDescription.trim().length > 0;
  }
}

