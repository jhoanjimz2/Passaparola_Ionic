import { Component, OnInit } from '@angular/core';
import { NavController }     from '@ionic/angular';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {

  constructor(
    private navcontroller: NavController
  ) { }

  ngOnInit() {
  }

  orderCart(queryParams: any = {}) {
    this.navcontroller.navigateForward(['pages/shopping/order-cart'], {
      queryParams: { ...queryParams },
    });
  }

}
