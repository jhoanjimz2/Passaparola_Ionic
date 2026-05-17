import { CommonModule }                                  from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Pipe,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { FormControlName, FormGroup }                    from '@angular/forms';
import { CameraSource }                                  from '@capacitor/camera';

import { IonicModule, ModalController }                  from '@ionic/angular';

import { TranslateModule, TranslateService }             from '@ngx-translate/core';
import { ToastrService }                                 from 'ngx-toastr';
import { Observable, Subscription }                      from 'rxjs';
import { SocialSummary }                                 from 'src/app/shared/interfaces/multiple-profile-business/social-summary';
import { PipesModule }                                   from 'src/app/shared/pipes/pipes.module';
import { UploadService }                                 from 'src/app/shared/services';
import { CameraService }                                 from 'src/app/shared/services/camera.service';
import { SocialService }                                 from 'src/app/shared/services/social.service';

@Component({
  selector: 'app-seat-gallery',
  templateUrl: './seat-gallery.component.html',
  styleUrls: ['./seat-gallery.component.scss'],
  standalone: true,
  imports: [TranslateModule, IonicModule, PipesModule, CommonModule],
})
export class SeatGalleryComponent implements OnInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements!: ElementRef[];
  @ViewChild('webAddress') webAddress!: ElementRef;

  displayMessage: any = {};
  form: FormGroup = {} as FormGroup;
  pictureGallery: any = {
    files: [],
    urls: [],
  };
  validationMessages: any;
  maxPicture: number = 10;

  subscriptions: Subscription[] = [];
  seat: SocialSummary = {} as SocialSummary;
  showDetail: boolean = false;

  constructor(
    private cameraService: CameraService,
    private translate: TranslateService,
    private toastr: ToastrService,
    private uploadService: UploadService,
    private modalController: ModalController,
    private socialService: SocialService
  ) {
    this.autoSubscribe(this.socialService.seatObservable, v => this.seat = v);
    this.autoSubscribe(this.socialService.showDetailObservable, v => this.showDetail = v);
  }
  private autoSubscribe<T>(obs$: Observable<T>, setter: (v: T) => void) {
    const sub = obs$.subscribe(setter);
    this.subscriptions.push(sub);
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  ngOnInit() {
    if (this.seat?.targetInfo?.seatInfo?.pictureGallery?.length) {
      this.pictureGallery.urls = this.seat.targetInfo?.seatInfo.pictureGallery.map((p: any) => {
        return {
          url: p,
          upload: true,
        };
      });
    }
  }

  ngAfterViewInit(): void {}

  onSave() {
    if (!this.pictureGallery.urls.length) {
      return;
    }

    this.uploadFiles(this.pictureGallery);
  }

  onCancel() {
    this.modalController.dismiss();
  }

  takePicture() {
    this.cameraService
      .getPhoto(CameraSource.Prompt)
      .then(({ imageUrl, file }) => {
        this.pictureGallery.files.push(file);
        this.pictureGallery.urls.push({ url: imageUrl, upload: false });
      })
      .catch((err) => {
        console.error(err);
      });
  }

  removePicture(indexGallery: number) {
    this.pictureGallery.urls = this.pictureGallery.urls.filter(
      (p: any, index: number) => indexGallery !== index
    );
    this.pictureGallery.files = this.pictureGallery.files.filter(
      (p: any, index: number) => indexGallery !== index
    );
  }

  private async uploadFiles(pictures: any) {
    let pictureGallery: any = [];

    pictures.files = pictures.files.filter((p: any) => p !== null);

    if (pictures.files.length) {
      pictureGallery = await this.uploadService.uploadFiles(
        pictures.files,
        'passaparola/company/seats/gallery/'
      );

      if (!pictureGallery) {
        this.toastr.error(
          this.translate.instant('BUSINESS_SUGGESTION.ERROR_UP_IMG')
        );
        return;
      }
    }

    let picturesFiltered: any = [];

    pictures.urls.forEach((p: any) => {
      if (p.upload === true) picturesFiltered.push(p.url);
    });

    this.modalController.dismiss({
      pictureGallery: [...picturesFiltered, ...pictureGallery],
    });
  }
}
