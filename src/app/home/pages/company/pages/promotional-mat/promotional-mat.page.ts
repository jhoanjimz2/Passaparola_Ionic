import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { Filesystem, Directory } from '@capacitor/filesystem';
import {
  FileOpener,
  FileOpenerOptions,
} from '@capacitor-community/file-opener';

import { Options } from 'ngx-qrcode-styling';

declare var require: any;

const html2pdf = require('html2pdf.js');
import html2canvas from 'html2canvas';
import { CompanySeat } from 'src/app/shared/interfaces/company/company-seat.interface';
import { User } from 'src/app/shared/interfaces/user/user.interface';
import { Company } from 'src/app/shared/interfaces/company/company.interface';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { CryptoService } from 'src/app/shared/services';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-promotional-mat',
  templateUrl: './promotional-mat.page.html',
  styleUrls: ['./promotional-mat.page.scss'],
})
export class PromotionalMatPage implements OnInit {
  seat: CompanySeat = {} as CompanySeat;
  user: User | Company | undefined;
  configQrWallet: Options = {
    width: 119,
    height: 119,
    data: '',
    // image: '/assets/images/logo.svg',
    margin: 0,
    dotsOptions: {
      color: '#000000',
    },
    backgroundOptions: {
      color: 'transparent',
    },
    imageOptions: {
      crossOrigin: 'anonymous',
      margin: 0,
    },
  };

  configQrCommunity: Options = {
    width: 75,
    height: 75,
    data: '',
    // image: '/assets/images/logo.svg',
    margin: 0,
    dotsOptions: {
      color: '#000000',
    },
    backgroundOptions: {
      color: 'transparent',
    },
    imageOptions: {
      crossOrigin: 'anonymous',
      margin: 0,
    },
  };
  downloading = false;

  constructor(
    private platform: Platform,
    private navController: NavController,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private cryptoService: CryptoService
  ) {}

  ngOnInit() {
    const seat = localStorage.getItem('appPassaparola_loginSeat');
    const user = localStorage.getItem('appPassaparola_user');

    if (!seat || !user) {
      this.navController.back();
      return;
    }

    this.seat = JSON.parse(seat!);
    this.user = JSON.parse(user!);

    this.configQrWallet = {
      ...this.configQrWallet,
      data: `${this.seat.wallet?.userId}-${this.seat.wallet?.prog}`,
    };

    const userIdEncrypt = this.cryptoService.encrypt(JSON.parse(user!).userID);
    const url = userIdEncrypt
      ? `${environment.urlRegister}/sing-up?promoCode=${userIdEncrypt}`
      : `${environment.urlRegister}/sing-up`;

    this.configQrCommunity = {
      ...this.configQrCommunity,
      // data: this.user?.userID,
      data: url,
    };
  }

  // d3f5ef3f-c8b6-4a07-8f4f-8bc7b74232f5

  async downloadPdf() {
    this.spinner.show();
    this.downloading = true;
    try {
      setTimeout(() => {
        const element = document.getElementById('material');

        html2canvas(element!).then(async (canvas) => {
          const imgData = canvas.toDataURL('image/png');
          const imgDiv = document.createElement('div');
          const imgElement = document.createElement('img');

          imgElement.src = imgData;
          imgElement.style.width = '10cm';
          imgElement.style.height = '20cm';
          imgDiv.appendChild(imgElement);

          const options = {
            margin: 10,
            filename: 'material.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: {
              unit: 'mm',
              format: 'a4',
              orientation: 'portrait',
            },
          };

          if (!this.platform.platforms().includes('capacitor')) {
            html2pdf().from(imgDiv).set(options).save();
            setTimeout(() => {
              this.downloading = false;
              this.spinner.hide();
            }, 1000);
            return;
          }

          const pdfDataUri = await html2pdf()
            .from(imgDiv)
            .set(options)
            .outputPdf('datauristring');

          const base64String = pdfDataUri.split(',')[1];
          const result = await Filesystem.writeFile({
            path: 'material.pdf',
            data: base64String,
            directory: Directory.Documents,
            // encoding: 'base64' as any,
          });

          this.openFile(result.uri);
        });
      }, 1000);
    } catch (error) {
      this.downloading = false;
      this.spinner.hide();
      this.toastr.error(this.translate.instant('GENERAL.UNABLE_DOWNLOAD_FILE'));
      console.error({ error });
    }
  }

  async openFile(path: string) {
    try {
      const fileOpenerOptions: FileOpenerOptions = {
        filePath: path,
        contentType: 'application/pdf',
        openWithDefault: true,
      };
      await FileOpener.open(fileOpenerOptions);
      setTimeout(() => {
        this.downloading = false;
        this.spinner.hide();
      }, 1000);
    } catch (e) {
      this.toastr.error(this.translate.instant('No se pudo abrir el archivo'));
      this.downloading = false;
      this.spinner.hide();
    }
  }
}
