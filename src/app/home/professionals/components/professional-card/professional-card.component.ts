import { Component, Input, Output, EventEmitter }                  from '@angular/core';
import { CommonModule }                                            from '@angular/common';
import { IonIcon }                                                 from '@ionic/angular/standalone';
import { Professional }                                            from 'src/app/shared/interfaces/professionals/professionals';
import { ModalController, NavController }                          from '@ionic/angular';
import { SendMessageComponent }                                    from '../send-message/send-message.component';
import { EmailCodeService }                                        from 'src/app/shared/services';
import { ContactComponent }                                        from '../contact/contact.component';

@Component({
  selector: 'app-professional-card',
  templateUrl: './professional-card.component.html',
  styleUrls: ['./professional-card.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonIcon
  ]
})
export class ProfessionalCardComponent {
  @Input() professional: Professional = {} as Professional;

  constructor(
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private emailCodeService: EmailCodeService
  ) {}

  get profileImage(): string {
    return this.professional.profile?.profilePictureUrlFile || 'https://placehold.co/80x80?text=default';
  }

  get businessName(): string {
    return this.professional.profile?.name || 'Sin nombre';
  }

  get firstSeat() {
    return this.professional.profile?.seats?.[0];
  }

  get seatName(): string {
    return this.firstSeat?.name || this.businessName;
  }

  get seatAddress(): string {
    return this.firstSeat?.address || 'Dirección no disponible';
  }

  get categories(): string {
    const cats = this.firstSeat?.categories || [];
    if (cats.length === 0) return 'Sin categoría';

    // Mostrar las primeras 2 categorías
    const categoryNames = cats.slice(0, 2).map(cat => cat.description).filter(Boolean);
    return categoryNames.join(', ') || 'Sin categoría';
  }

  get cashbackPercentage(): number {
    return this.firstSeat?.cashBackPercentage ||
           this.professional.profile?.cashBackPercentage ||
           0;
  }

  get services(): string {
    const tags = this.firstSeat?.tags || [];
    if (tags.length === 0) return 'No hay servicios disponibles';

    // Mostrar los primeros 3 servicios
    return tags.slice(0, 3).join(', ');
  }

  get hasMultipleServices(): boolean {
    return (this.firstSeat?.tags?.length || 0) > 3;
  }

  get additionalServicesCount(): number {
    const totalTags = this.firstSeat?.tags?.length || 0;
    return Math.max(0, totalTags - 3);
  }

  get phoneNumber(): string {
    return this.firstSeat?.phone ||
           this.professional.phoneNumber ||
           '';
  }

  get hasPhone(): boolean {
    return !!this.phoneNumber;
  }

  get seatImage(): string {
    return this.firstSeat?.pictureUlrFile ||
           this.firstSeat?.coverUrlFile ||
           this.profileImage;
  }

  async onRequestClick() {
    const modal = await this.modalCtrl.create({
      component: SendMessageComponent,
      cssClass: ['radius-modals', 'modal-60vh'],
      breakpoints: [0, 1],
      initialBreakpoint: 1,
      componentProps: {
        professional: this.professional
      }
    });
    await modal.present();
  }

  async onContactClick() {
    const modal = await this.modalCtrl.create({
      component: ContactComponent,
      cssClass: ['radius-modals', 'modal-45vh'],
      breakpoints: [0, 1],
      initialBreakpoint: 1,
      componentProps: {
        professional: this.professional
      }
    });
    await modal.present();
  }

  goSeatDetail(id: string) {
    this.navCtrl.navigateForward(['/pages/company/seat/modify', id], {
      queryParams: { detail: true },
    });
  }
}
