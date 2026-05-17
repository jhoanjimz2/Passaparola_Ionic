import { Component, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { CameraService }                                     from 'src/app/shared/services/camera.service';
import { CameraSource }                                      from '@capacitor/camera';
import { Events }                                            from 'src/app/shared/interfaces/events/events';
import { v4 as uuidv4 }                                      from 'uuid';
import { TranslateService }                                  from '@ngx-translate/core';
import { ToastrService }                                     from 'ngx-toastr';
import { EventsService, UploadService }                      from 'src/app/shared/services';
import { ModalController }                                   from '@ionic/angular';
import { SeatViewImageComponent }                            from '../../modals/seat/seat-view-image/seat-view-image.component';


@Component({
  selector: 'app-portada-profile-event',
  templateUrl: './portada-profile-event.component.html',
  styleUrls: ['./portada-profile-event.component.scss'],
})
export class PortadaProfileEventComponent implements OnDestroy {
  @Input() edit:         boolean = false;
  @Input() create:       boolean = false;
  @Input() preview:      boolean = false;
  @Input() eventProfile: Events  = {} as Events;
  @Output() abreElModal:   EventEmitter<any> = new EventEmitter();

  get updating():boolean { return ((this.edit || this.create) && !this.preview) }
  get view():boolean { return ((!this.edit && !this.create) || this.preview)}

  constructor(
    private cameraService: CameraService,
    private translate: TranslateService,
    private toastr: ToastrService,
    private uploadService: UploadService,
    private eventsService: EventsService,
    private modalController: ModalController
  ) {
  }
  ngOnDestroy(): void {}

  async openUpdateData(type: string) {
    if (this.view) return;
    this.abreElModal.emit(type)
  }
  async seatOpenViewImage(imgGallery: string) {
    if (!imgGallery) return
    const modal = await this.modalController.create({
      component: SeatViewImageComponent,
      cssClass: 'bg-transp',
      componentProps: { imgGallery }
    });
    modal.present();
  }


  takePicture(cover: boolean) {
    this.cameraService.getPhoto(CameraSource.Prompt).then(({ imageUrl, file }) => {
      const arrayTypeFile = file!.type.split('/');
      const type = arrayTypeFile[1];
      if (cover) {
        const path = `passaparola/events/cover/${uuidv4()}.${type}`;
        this.eventProfile.coverUrlFile = imageUrl!;
        this.uploadPicture(cover, file, path);
      } else {
        const path = `passaparola/events/picture/${uuidv4()}.${type}`;
        this.eventProfile.pictureUlrFile = imageUrl!;
        this.uploadPicture(cover, file, path);
      }
    })
    .catch((err) => console.error(err) );
  }

  async uploadPicture(cover: boolean, pictureFile: any, path: string) {
    const fileUpload: any = await this.uploadService.uploadFile(pictureFile!, path);
    if (!fileUpload) {
      this.toastr.error(
        this.translate.instant('BUSINESS_SUGGESTION.ERROR_UP_IMG')
      );
      return;
    }
    if (cover) {
      this.eventProfile.coverUrlFile = fileUpload!;
      this.seatCover();
    } else {
      this.eventProfile.pictureUlrFile = fileUpload!;
      this.seatProfile()
    }
  }

  seatCover() {
    this.eventsService.seatCover(this.eventProfile.id!,this.eventProfile.coverUrlFile!)
    .subscribe({ next:() => {}, error:() => {}})
  }
  seatProfile() {
    this.eventsService.seatProfile(this.eventProfile.id!,this.eventProfile.pictureUlrFile!)
    .subscribe({ next:() => {}, error:() => {}})
  }

}
