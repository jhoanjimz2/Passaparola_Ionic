import { Component, OnInit }     from '@angular/core';

import { ModalController }       from '@ionic/angular';

import { SeatTypeComponent }     from './components/seat-type/seat-type.component';
import { SeatContactComponent }  from './components/seat-contact/seat-contact.component';
import { SeatService }           from 'src/app/shared/services/seat.service';
import { AuthenticationService } from 'src/app/core/service/authentication.service';
import { ToastrService }         from 'ngx-toastr';
import { SessionService }        from '../../../../../shared/services/session.service';

@Component({
  selector: 'app-seat',
  templateUrl: './seat.page.html',
  styleUrls: ['./seat.page.scss'],
})
export class SeatPage implements OnInit {
  infiniteScrollEnabled = false;
  limit = 20;
  seat: any;
  seatList: any[] = [];
  page = 1;

  constructor(
    private modalController: ModalController,
    private seatService: SeatService,
    private authenticationService: AuthenticationService,
    private toastr: ToastrService,
    public sessionService: SessionService
  ) {}

  ngOnInit() {}

  ionViewDidEnter() {
    this.findAll(true);
  }

  async onOpenModalSeatType() {
    const modal = await this.modalController.create({
      component: SeatTypeComponent,
      cssClass: 'modal-95vh',
      backdropDismiss: this.sessionService.isProfessionalAdministrative ? false : true,
      componentProps: {},
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();

    if (data.type) {
      this.seat = data;
      this.onSeatContact();
    }
  }

  async onSeatContact() {
    const modal = await this.modalController.create({
      component: SeatContactComponent,
      cssClass: 'modal-90vh',
      backdropDismiss: this.sessionService.isProfessionalAdministrative ? false : true,
      componentProps: {},
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();

    if (data.pin) {
      this.seat = {
        ...this.seat,
        ...data,
        profile: this.authenticationService.user.profile,
      };
      this.create();
    }
  }

  findAll(reset = false, event?: any) {
    if (reset) {
      this.seatList = [];
      this.infiniteScrollEnabled = false;
      this.page = 1;
    }
    this.seatService
      .findAllByUser({
        offset: this.page,
        limit: this.limit,
      })
      .subscribe({
        next: ({ data, metadata }: any) => {
          this.seatList.push(...data);
          this.page++;

          if (metadata.page < metadata.lastPage)
            this.infiniteScrollEnabled = true;
          else this.infiniteScrollEnabled = false;

          if (event?.target) event?.target?.complete();


          if (!data.length && this.sessionService.isProfessionalAdministrative) {
            setTimeout(() => {
              this.onOpenModalSeatType();
            }, 3000)
          }
        },
      });
  }
  private create() {
    this.seatService.create(this.seat).subscribe({
      next: (response) => {
        this.seatList.push(response);
        this.toastr.success('Informazioni da memorizzare correttamente');
      },
    });
  }
}
