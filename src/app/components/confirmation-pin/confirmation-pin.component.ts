import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { CompanyService, UserService } from 'src/app/shared/services';

@Component({
  selector: 'app-confirmation-pin',
  templateUrl: './confirmation-pin.component.html',
  styleUrls: ['./confirmation-pin.component.scss'],
})
export class ConfirmationPinComponent implements OnInit {
  pin = '';
  @Input() title = 'MODAL_CONFIRMATION_PIN.TITLE';
  @Input() fromLogin = false;
  @Input() isCompany = false;
  @Input() uuid = ''; // user/compnay/seat
  @Input() passaparolaCard = false; // user/compnay/seat

  constructor(
    private modalController: ModalController,
    private userService: UserService,
    private companyService: CompanyService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 1500);
  }

  inputValue(input: string) {
    if (this.pin.length === 5) return;
    this.pin += input;
  }

  erase() {
    if (this.pin.length === 0) return;
    this.pin = this.pin.slice(0, -1);
  }

  sendPin() {
    if (this.pin.length !== 5) return;

    if (this.fromLogin) {
      this.companyService.checkPinSeat(this.pin, this.uuid).subscribe({
        next: () => {
          this.modalController.dismiss({
            pin: this.pin,
          });
        },
      });
      return;
    }

    if (this.isCompany) {
      this.userService.checkPinCompany(this.pin).subscribe({
        next: () => {
          this.modalController.dismiss({
            pin: this.pin,
          });
        },
      });
      return;
    }

    this.userService.checkPin(this.pin).subscribe({
      next: () => {
        this.modalController.dismiss({
          pin: this.pin,
        });
      },
    });
  }

  cancel() {
    this.modalController.dismiss();
  }
}
