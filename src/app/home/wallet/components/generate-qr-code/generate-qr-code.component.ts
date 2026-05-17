import { Component, Input, OnInit } from '@angular/core';

import { Options } from 'ngx-qrcode-styling';

@Component({
  selector: 'app-generate-qr-code',
  templateUrl: './generate-qr-code.component.html',
  styleUrls: ['./generate-qr-code.component.scss'],
})
export class GenerateQrCodeComponent implements OnInit {
  @Input() data = '';
  config: Options = {
    width: 250,
    height: 250,
    data: '',
    image: '/assets/images/logo-orange-br.png',
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
  amount = 0;
  reference = 0;

  constructor() {}

  ngOnInit() {
    this.config = { ...this.config, data: this.data };
    const data = JSON.parse(this.data);
    this.amount = data.amount;
    this.reference = this.generateReference();
  }

  generateReference() {
    const fechaActual = new Date();
    const timestamp = fechaActual.getTime();
    const numeroAleatorio = parseInt(
      ('00000000' + (timestamp % 100000000)).slice(-8)
    );
    return numeroAleatorio;
  }
}
