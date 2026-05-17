import { Component, Input, OnInit } from '@angular/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { Platform } from '@ionic/angular';
import {
  FileOpener,
  FileOpenerOptions,
} from '@capacitor-community/file-opener';

import { TranslateService } from '@ngx-translate/core';
import { Options } from 'ngx-qrcode-styling';
import { ToastrService } from 'ngx-toastr';

import html2canvas from 'html2canvas';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-qr-code',
  templateUrl: './qr-code.component.html',
  styleUrls: ['./qr-code.component.scss'],
})
export class QrCodeComponent implements OnInit {
  @Input() title = '';
  @Input() subTitle = '';
  @Input() label = '';
  @Input() textToCopy = '';
  @Input() textToShow = '';

  config: Options = {
    width: 250,
    height: 250,
    data: '',
    image: '/assets/images/p-community–2.png',
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

  constructor(
    private platform: Platform,
    private toastr: ToastrService,
    private translate: TranslateService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.config = { ...this.config, data: this.textToCopy };
  }

  onCopyDataToClipboard(): void {
    try {
      navigator.clipboard.writeText(this.textToCopy);
      this.toastr.success(
        this.translate.instant('GENERAL.INFO_COPIED'),
        '',
        {}
      );
    } catch (err) {
      this.toastr.error(
        this.translate.instant('GENERAL.INFO_COPY_ERROR'),
        '',
        {}
      );
    }
  }

  async onDownload(qrcode: any) {
    try {
      const platforms = this.platform.platforms();
      if (platforms.includes('mobileweb')) {
        qrcode.download('QR.png').subscribe(async (res: any) => {
          console.info('download:', res);
          const dataUrl = qrcode.canvas.toDataURL('image/png');

          // Convertir data URL a blob
          const response = await fetch(dataUrl);
          const blob = await response.blob();

          // Convertir blob a base64
          const base64Data = (await this.convertBlobToBase64(blob)) as string;

          // Guardar la imagen en el almacenamiento
          const fileName = 'qrcode.png';
          const result = await Filesystem.writeFile({
            path: fileName,
            data: base64Data,
            directory: Directory.Documents,
            encoding: Encoding.UTF8,
          });
        });
      } else {
        this.spinner.show();
        const canvas = qrcode.canvas.nativeElement.children[0];
        canvas.toBlob(async (blob: any) => {
          if (blob) {
            const base64Data = (await this.convertBlobToBase64(blob)) as string;
            const fileName = 'qrcode.png';
            const result = await Filesystem.writeFile({
              path: fileName,
              data: base64Data.split(',')[1], // Remove the base64 prefix
              directory: Directory.Documents,
              // encoding: Encoding.UTF8,
            });

            this.openFile(result.uri);
          }
        });
      }
    } catch (e) {
      console.error('Error saving file', e);
      this.spinner.hide();
    }
  }

  private convertBlobToBase64(
    blob: Blob
  ): Promise<string | ArrayBuffer | null> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
        this.spinner.hide();
      };
      reader.readAsDataURL(blob);
    });
  }

  async onShared() {
    const data = {
      title: 'Passaparola App',
      text: this.translate.instant('GENERAL.TEXT_INVITE'),
      url: this.textToCopy,
      dialogTitle: 'Passaparola App',
    };

    await Share.share(data);
  }

  async openFile(path: string) {
    try {
      const fileOpenerOptions: FileOpenerOptions = {
        filePath: path,
        contentType: 'image/png',
        openWithDefault: true,
      };
      await FileOpener.open(fileOpenerOptions);
      setTimeout(() => {
        // this.downloading = false;
        this.spinner.hide();
      }, 1000);
    } catch (e) {
      this.toastr.error(this.translate.instant('No se pudo abrir el archivo'));
      // this.downloading = false;
      this.spinner.hide();
    }
  }
}
