import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';

import { NfcTag, NfcUtils } from '@capawesome-team/capacitor-nfc';
import { ModalController } from '@ionic/angular';
import { Options } from 'ngx-qrcode-styling';
import { ConfirmationPinComponent } from 'src/app/components/confirmation-pin/confirmation-pin.component';

import {
  NfcService,
  ToolNfcService,
  WalletService,
} from 'src/app/shared/services';

@Component({
  selector: 'app-payment-qr',
  templateUrl: './payment-qr.component.html',
  styleUrls: ['./payment-qr.component.scss'],
})
export class PaymentQrComponent implements OnInit, OnDestroy {
  @Input() data: any = '';
  @Input() decimalAmount: string = '00';
  @Input() mainAmount: string = '0';
  @Output() callClose = new EventEmitter<void>();

  config: Options = {
    width: 200,
    height: 200,
    data: '',
    image: '/assets/images/logo-orange-br.png',
    margin: 0,
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

  payOption: 'qr' | 'nfc' = 'qr';

  scannedTag: NfcTag | undefined;

  constructor(
    private toolNfcService: ToolNfcService,
    private nfcService: NfcService,
    private walletService: WalletService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.data.amount = parseFloat(this.data.amount);
    this.config = { ...this.config, data: JSON.stringify(this.data) };
    this.stopScanNfc();
  }

  ngOnDestroy() {
    this.toolNfcService.removeAllListeners();
  }

  onClose() {
    this.callClose.emit();
  }

  async scanNFC() {
    return;
    const isSupported = await this.nfcService.isSupported();
    const isEnabled = await this.nfcService.isEnabled();

    if (!isSupported || !isEnabled) return;

    const tag = (await this.toolNfcService.read()) as NfcTag;

    if (tag) {
      this.scannedTag = tag;
      const id = this.bytesToHex(tag.id, '', ':');
      this.getPassaparolaCard(id);
    }

    this.stopScanNfc();
    // this.scanNFC();
  }

  stopScanNfc() {
    return;
    this.toolNfcService.removeAllListeners();
  }

  bytesToHex(
    bytes: unknown,
    start: string = '0x',
    separator: string = ''
  ): string {
    if (!bytes || !Array.isArray(bytes)) {
      return '';
    }
    const { hex } = new NfcUtils().convertBytesToHex({
      bytes,
      start,
      separator,
    });
    return hex;
  }

  getPassaparolaCard(id: string) {
    this.walletService.getPassaparolaCard(id).subscribe({
      next: async (response) => {
        let isBussines = false;
        if (this.data.amount >= 50) {
          const checkUserIdTo = response.wallet.userId.charAt(
            response.wallet.userId.length - 1
          );

          if (checkUserIdTo === 'B' || checkUserIdTo === 'P') isBussines = true;
          const modal = await this.modalController.create({
            component: ConfirmationPinComponent,
            backdropDismiss: true,
            componentProps: { isCompany: isBussines },
            cssClass: 'modal-95vh',
          });
          await modal.present();
          const { data } = await modal.onDidDismiss();

          if (!data) {
            this.stopScanNfc();
            this.scanNFC();
          }

          if (data.pin) this.confirmTransfer();
        } else {
          this.confirmTransfer();
        }
      },
      error: () => {
        this.stopScanNfc();
        this.scanNFC();
      },
    });
  }

  confirmTransfer() {
    // PaymentSuccessNotificationComponent
  }

  transferAtm() {}
}
