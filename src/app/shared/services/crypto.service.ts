import { Injectable } from '@angular/core';

import * as CryptoJS from 'crypto-js';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CryptoService {
  constructor() {}

  encrypt(data: any) {
    const cleanKey = environment.cryptoJS.key;
    let iv = CryptoJS.enc.Hex.parse(cleanKey);
    let passKey = cleanKey
      .substring(0, environment.cryptoJS.size)
      .concat(environment.cryptoJS.lastKeyEncrypt);
    let saltKey = cleanKey
      .substring(
        environment.cryptoJS.size,
        cleanKey.length - environment.cryptoJS.size
      )
      .concat(environment.cryptoJS.lastKeyEncrypt);
    let pass = CryptoJS.enc.Utf8.parse(passKey);
    let salt = CryptoJS.enc.Utf8.parse(saltKey);
    let key = CryptoJS.PBKDF2(pass.toString(CryptoJS.enc.Utf8), salt, {
      keySize: 128 / 32,
      iterations: 1000,
    });
    data = CryptoJS.AES.encrypt(data, key, {
      mode: CryptoJS.mode.CBC,
      iv: iv,
      padding: CryptoJS.pad.Pkcs7,
    });
    return this.removeSymbol(data.toString());
  }

  async decrypt(
    data: any,
    ivEncrypt: any = null,
    passEncrypt: any = null,
    keyEncrypt: any = null
  ) {
    try {
      data = this.restoreSymbol(data);
      const cleanKey = environment.cryptoJS.key;
      let iv = CryptoJS.enc.Hex.parse(ivEncrypt || cleanKey);
      let pass = CryptoJS.enc.Utf8.parse(
        passEncrypt ||
          cleanKey
            .substring(0, environment.cryptoJS.size)
            .concat(environment.cryptoJS.lastKeyEncrypt)
      );
      let salt = CryptoJS.enc.Utf8.parse(
        keyEncrypt ||
          cleanKey
            .substring(
              environment.cryptoJS.size,
              cleanKey.length - environment.cryptoJS.size
            )
            .concat(environment.cryptoJS.lastKeyEncrypt)
      );
      let key = CryptoJS.PBKDF2(pass.toString(CryptoJS.enc.Utf8), salt, {
        keySize: 128 / 32,
        iterations: 1000,
      });

      let cipherParams = CryptoJS.lib.CipherParams.create({
        ciphertext: CryptoJS.enc.Base64.parse(data),
      });
      let decrypted = CryptoJS.AES.decrypt(cipherParams, key, {
        mode: CryptoJS.mode.CBC,
        iv: iv,
        padding: CryptoJS.pad.Pkcs7,
      });
      return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      return '';
    }
  }

  removeSymbol(data: string) {
    const aux = /[+=]/g;
    return data.replace(aux, function (match: string) {
      return match === '+' ? '$' : '*';
    });
  }

  restoreSymbol(data: string) {
    const aux = /[$*]/g;
    return data.replace(aux, function (match: string) {
      return match === '$' ? '+' : '=';
    });
  }

  encryptedData(data: string) {
    return CryptoJS.AES.encrypt(data, environment.cryptoJS.key).toString();
  }

  decryptData(encryptedData: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedData, environment.cryptoJS.key);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}
