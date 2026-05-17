import { Injectable } from '@angular/core';

import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class CameraService {
  constructor(private translate: TranslateService) {}

  async getPhoto(
    source: CameraSource = CameraSource.Camera
  ): Promise<{ imageUrl: string; file: Blob }> {
    return new Promise(async (resolve, reject) => {
      try {
        const image = await Camera.getPhoto({
          quality: 50,
          allowEditing: false,
          resultType: CameraResultType.DataUrl,
          source: source,
          promptLabelHeader: this.translate.instant('CAMERA.TAKE_PICTURE'),
          promptLabelPhoto: this.translate.instant('CAMERA.GALLERY'),
          promptLabelPicture: this.translate.instant('CAMERA.CAMERA'),
          promptLabelCancel: this.translate.instant('CAMERA.CANCEL'),
        });

        resolve({
          imageUrl: image.dataUrl!,
          file: this.dataURIToBlob(image.dataUrl!),
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  dataURIToBlob(dataURI: string): Blob {
    const splitDataURI = dataURI.split(',');
    const byteString =
      splitDataURI[0].indexOf('base64') >= 0
        ? atob(splitDataURI[1])
        : decodeURI(splitDataURI[1]);
    const mimeString = splitDataURI[0].split(':')[1].split(';')[0];

    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++)
      ia[i] = byteString.charCodeAt(i);

    return new Blob([ia], { type: mimeString });
  }
}
