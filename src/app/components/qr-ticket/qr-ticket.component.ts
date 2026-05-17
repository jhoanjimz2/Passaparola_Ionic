import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Options }                             from 'ngx-qrcode-styling';

@Component({
  selector: 'app-qr-ticket',
  templateUrl: './qr-ticket.component.html',
  styleUrls: ['./qr-ticket.component.scss'],
})
export class QrTicketComponent implements OnInit, OnDestroy {
  @Input() data = '';

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
      imageSize: 0.5,
      // crossOrigin?: string;
    },
  };

  constructor() { }

  ngOnDestroy(): void {}

  ngOnInit() {
    this.config = { ...this.config, data: this.data };
  }

}
