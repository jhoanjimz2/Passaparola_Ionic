import { Component, Input, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/core/service/authentication.service';
import { filter } from 'rxjs/operators';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-select-list-seat',
  templateUrl: './select-list-seat.component.html',
  styleUrls: ['./select-list-seat.component.scss'],
})
export class SelectListSeatComponent implements OnInit {
  @Input() seatSelected!: any;

  seats: any = [];

  constructor(
    private authenticationService: AuthenticationService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.seats = this.authenticationService.user.profile.seats.filter(
      (seat: any) => seat.isVisible === true
    );
  }

  onSelectedSeat(seatSelected: any) {
    this.modalController.dismiss({
      seatSelected,
    });
  }
}
