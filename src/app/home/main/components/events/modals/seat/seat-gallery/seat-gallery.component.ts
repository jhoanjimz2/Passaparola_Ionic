import { Component, Input, OnDestroy, OnInit }                from '@angular/core';
import { CameraSource }                                       from '@capacitor/camera';
import { ModalController }                                    from '@ionic/angular';
import { TranslateService }                                   from '@ngx-translate/core';
import { ToastrService }                                      from 'ngx-toastr';
import { Subscription }                                       from 'rxjs';
import { Events }                                             from 'src/app/shared/interfaces/events/events';
import { EventsService, UploadService }                       from 'src/app/shared/services';
import { CameraService }                                      from 'src/app/shared/services/camera.service';

@Component({
  selector: 'app-seat-gallery',
  templateUrl: './seat-gallery.component.html',
  styleUrls: ['./seat-gallery.component.scss'],
})
export class SeatGalleryComponent  implements OnInit, OnDestroy {
  @Input() showDetail: boolean = false;

  maxPicture: number = 10;

  pictureGallery: any = {
    files: [],
    urls: [],
  };

  private subscription!: Subscription;
  eventProfile: Events = {} as Events;

  constructor(
    private cameraService: CameraService,
    private modalController: ModalController,
    private uploadService: UploadService,
    private translate: TranslateService,
    private toastr: ToastrService,
    private eventsService: EventsService
  ) {
    this.subscription = this.eventsService.obtenerEventSelect().subscribe({
      next: (event) => { this.eventProfile = structuredClone(event); }
    });
  }
  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }

  ngOnInit() {
    if(!this.eventProfile.pictureGallery) this.eventProfile.pictureGallery = [];
    if (this.eventProfile.pictureGallery.length) {
      this.pictureGallery.urls = this.eventProfile.pictureGallery.map((p: any) => {
        return { url: p, upload: true };
      });
    }
  }

  removePicture(indexGallery: number) {
    this.pictureGallery.urls = this.pictureGallery.urls.filter(
      (p: any, index: number) => indexGallery !== index
    );
    this.pictureGallery.files = this.pictureGallery.files.filter(
      (p: any, index: number) => indexGallery !== index
    );
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

  onCancel() {
    this.modalController.dismiss();
  }

  onSave() {
    this.uploadFiles(this.pictureGallery);
  }

  private async uploadFiles(pictures: any) {
    let pictureGallery: any = [];
    pictures.files = pictures.files.filter((p: any) => p !== null);

    if (pictures.files.length) {
      pictureGallery = await this.uploadService.uploadFiles(
        pictures.files, 'passaparola/events/seats/gallery'
      );

      if (!pictureGallery) {
        this.toastr.error( this.translate.instant('BUSINESS_SUGGESTION.ERROR_UP_IMG') );
        return;
      }
    }

    let picturesFiltered: any = [];

    pictures.urls.forEach((p: any) => {
      if (p.upload === true) picturesFiltered.push(p.url)
    });

    this.eventsService.seatGallery(this.eventProfile.id!,[...picturesFiltered, ...pictureGallery]).subscribe({
      next:() => {
        this.eventsService.actualizarEvento({ pictureGallery: [...picturesFiltered, ...pictureGallery] });
        this.modalController.dismiss();
      },
      error:() => {}
    })

  }

}

