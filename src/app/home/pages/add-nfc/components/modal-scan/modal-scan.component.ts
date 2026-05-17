import { Component, OnDestroy, OnInit } from '@angular/core';
import { Nfc, NfcTag, NfcUtils } from '@capawesome-team/capacitor-nfc';
import { ModalController } from '@ionic/angular';
import { Subscription, take } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import {
  CapacitorNfcService,
  NfcService,
  PlatformService,
} from 'src/app/shared/services';

@UntilDestroy()
@Component({
  selector: 'app-modal-scan',
  templateUrl: './modal-scan.component.html',
  styleUrls: ['./modal-scan.component.scss'],
})
export class ModalScanComponent implements OnInit, OnDestroy {
  scannedTag: NfcTag | undefined;
  scannedTag$: Subscription | undefined;

  constructor(
    private nfcService: NfcService,
    private capacitorNfcService: CapacitorNfcService,
    private modalController: ModalController,
    private platformService: PlatformService
  ) {}

  ngOnInit() {
    (async () => {
      this.scanNFC();
    })();
  }

  ngOnDestroy() {
    this.stopScanNfc();
  }

  stopScanNfc() {
    this.nfcService.stopScanSession();
    this.scannedTag$?.unsubscribe();
  }

  async scanNFC() {
    if (this.scannedTag$) {
      this.scannedTag$.unsubscribe();
    }
    try {
      const isSupported = await this.nfcService.isSupported();
      const isEnabled = await this.nfcService.isEnabled();

      if (!isSupported || !isEnabled) return;

      await this.capacitorNfcService.startScanSession();

      if (this.platformService.isIos()) {
        this.scannedTag$ = this.capacitorNfcService.scannedTag$
          .pipe(take(1), untilDestroyed(this))
          .subscribe((tag: NfcTag) => {
            this.scannedTag = tag;
            const id = this.bytesToHex(tag.id, '', ':');
            console.info('NFC tag scanned:', tag);
            this.nfcService.stopScanSession();
            this.modalController.dismiss({
              id,
            });
          });
      } else {
        this.scannedTag$ = this.capacitorNfcService.scannedTag$.subscribe({
          next: (tag: NfcTag) => {
            if (tag) {
              this.scannedTag = tag;
              const id = this.bytesToHex(tag.id, '', ':');
              console.info('NFC tag scanned:', id);
              this.modalController.dismiss({
                id,
              });
            }
          },
          error: (error) => {
            console.error('Error scanning NFC tag:', error);
          },
        });
      }
    } catch (error) {
      console.error('Error scanning NFC tag:', error);
    }
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
}
