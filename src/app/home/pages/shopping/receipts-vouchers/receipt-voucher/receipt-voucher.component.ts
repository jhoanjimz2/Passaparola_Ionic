import { Component, Input, OnInit } from '@angular/core';
import { Options }                  from 'ngx-qrcode-styling';

@Component({
  selector: 'app-receipt-voucher',
  templateUrl: './receipt-voucher.component.html',
  styleUrls: ['./receipt-voucher.component.scss'],
})
export class ReceiptVoucherComponent  implements OnInit {
  @Input() voucher: boolean = false;
  productos = ['','','','','','','','','','']

  config: Options = {
    data: '',
    // image: '/assets/images/logo-orange-br.png',
    margin: 5,
    dotsOptions: {
      color: '#000000',
      // type: 'classy',
    },
    backgroundOptions: {
      color: '#ffffff',
    },
    imageOptions: {
      // crossOrigin: 'anonymous',
      margin: 0,
      hideBackgroundDots: false,
      imageSize: 0.1,
      // crossOrigin?: string;
    },
  };

  constructor() { }

  ngOnInit() {
    this.config = { ...this.config, data: '121212' };
  }

}
