import { Component, EventEmitter, Output } from '@angular/core';
import { IonIcon }                         from "@ionic/angular/standalone";
import { NavController }                   from '@ionic/angular';

@Component({
  selector: 'app-success-wishbuy',
  templateUrl: './success-wishbuy.component.html',
  styleUrls: ['./success-wishbuy.component.scss'],
  standalone: true,
  imports: [IonIcon]
})
export class SuccessWishbuyComponent  {
  @Output() newWishBuy: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private navCtrl: NavController
  ) {}

  tornaHome() {
    this.navCtrl.navigateRoot(['/main']);
  }

  newWishbuy() {
    this.newWishBuy.emit();
  }

}
