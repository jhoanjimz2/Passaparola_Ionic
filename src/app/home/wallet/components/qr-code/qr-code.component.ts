import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { Options } from 'ngx-qrcode-styling';
import { ToastrService } from 'ngx-toastr';
import { Wallet } from 'src/app/shared/interfaces/wallet/wallet.interface';

@Component({
  selector: 'app-qr-code',
  templateUrl: './qr-code.component.html',
  styleUrls: ['./qr-code.component.scss'],
})
export class QrCodeComponent implements OnInit {
  @Input() data = '';
  @Input() wallet: Wallet = {} as Wallet;
  config: Options = {
    width: 250,
    height: 250,
    data: '',
    image: '/assets/images/p-wallet–2.png',
    margin: 5,
    dotsOptions: {
      color: '#000000',
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

  constructor(
    private toastr: ToastrService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.config = { ...this.config, data: this.data };
  }

  copyDataToClipboard(): void {
    try {
      navigator.clipboard.writeText(this.data);
      this.toastr.success(
        this.translate.instant('WALLET.QR_CODE.COPY_INFO'),
        '',
        {}
      );
    } catch (err) {
      this.toastr.error('WALLET.QR_CODE.COPY_INFO_ERROR', '', {});
    }
  }
}
