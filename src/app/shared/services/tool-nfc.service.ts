import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';

import { Nfc, NfcUtils, NfcTagTechType } from '@capawesome-team/capacitor-nfc';

@Injectable({
  providedIn: 'root',
})
export class ToolNfcService {
  constructor() {}

  createNdefTextRecord = () => {
    const utils = new NfcUtils();
    const { record } = utils.createNdefTextRecord({
      text: 'Capacitor NFC Plugin',
    });
    return record;
  };

  write = async () => {
    return new Promise((resolve) => {
      const record = this.createNdefTextRecord();

      Nfc.addListener('nfcTagScanned', async (event) => {
        await Nfc.write({ message: { records: [record] } });
        await Nfc.stopScanSession();
        resolve(true);
      });

      Nfc.startScanSession();
    });
  };

  read = async () => {
    return new Promise((resolve) => {
      Nfc.addListener('nfcTagScanned', async (event) => {
        await Nfc.stopScanSession();
        resolve(event.nfcTag);
      });

      Nfc.startScanSession();
    });
  };

  makeReadOnly = async () => {
    return new Promise((resolve) => {
      Nfc.addListener('nfcTagScanned', async (event) => {
        await Nfc.makeReadOnly();
        await Nfc.stopScanSession();
        resolve(true);
      });

      Nfc.startScanSession();
    });
  };

  readSignature = async () => {
    return new Promise((resolve) => {
      Nfc.addListener('nfcTagScanned', async (event) => {
        if (Capacitor.getPlatform() === 'android') {
          // 1. Connect to the tag.
          await Nfc.connect({ techType: NfcTagTechType.NfcA });
          // 2. Send one or more commands to the tag and receive the response.
          const result = await Nfc.transceive({ data: [60, 0] });
          // 3. Close the connection to the tag.
          await Nfc.close();
          await Nfc.stopScanSession();
          resolve(result);
        } else {
          // 1. Send one or more commands to the tag and receive the response.
          const result = await Nfc.transceive({
            techType: NfcTagTechType.NfcA,
            data: [60, 0],
          });
          await Nfc.stopScanSession();
          resolve(result);
        }
      });

      Nfc.startScanSession();
    });
  };

  erase = async () => {
    return new Promise((resolve) => {
      Nfc.addListener('nfcTagScanned', async (event) => {
        await Nfc.erase();
        await Nfc.stopScanSession();
        resolve(true);
      });

      Nfc.startScanSession();
    });
  };

  format = async () => {
    return new Promise((resolve) => {
      Nfc.addListener('nfcTagScanned', async (event) => {
        await Nfc.format();
        await Nfc.stopScanSession();
        resolve(true);
      });

      Nfc.startScanSession();
    });
  };

  isSupported = async () => {
    const { isSupported } = await Nfc.isSupported();
    return isSupported;
  };

  isEnabled = async () => {
    const { isEnabled } = await Nfc.isEnabled();
    return isEnabled;
  };

  openSettings = async () => {
    await Nfc.openSettings();
  };

  checkPermissions = async () => {
    const { nfc } = await Nfc.checkPermissions();
    return nfc;
  };

  requestPermissions = async () => {
    const { nfc } = await Nfc.requestPermissions();
    return nfc;
  };

  removeAllListeners = async () => {
    await Nfc.removeAllListeners();
  };
}
