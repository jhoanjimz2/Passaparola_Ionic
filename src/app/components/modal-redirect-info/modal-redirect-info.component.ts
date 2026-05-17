import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Browser } from '@capacitor/browser';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-modal-redirect-info',
  templateUrl: './modal-redirect-info.component.html',
  styleUrls: ['./modal-redirect-info.component.scss'],
})
export class ModalRedirectInfoComponent implements OnInit {
  @Input() url = '';

  constructor(
    private modalController: ModalController,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {}

  ngOnInit() {}

  async openUrl() {
    this.modalController.dismiss();
    await Browser.open({ url: this.url });
  }

  onCopyDataToClipboard(): void {
    try {
      navigator.clipboard.writeText('+393662025750');
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
}
