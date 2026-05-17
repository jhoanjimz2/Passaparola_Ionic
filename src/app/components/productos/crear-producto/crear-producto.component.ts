import { Component, OnDestroy }                   from '@angular/core';
import { FormBuilder, FormControl, FormGroup }    from '@angular/forms';
import { CameraSource }                           from '@capacitor/camera';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { Subscription }                           from 'rxjs';
import { ProductosService, UploadService }        from 'src/app/shared/services';
import { CameraService }                          from 'src/app/shared/services/camera.service';
import { KeyboardService }                        from 'src/app/shared/services/keyboard.service';
import { required, requiredAndNumeric }           from 'src/app/shared/validators/events.validator';
import { ModalGalleryComponent }                  from '../../modal-gallery/modal-gallery.component';
import { TranslateService }                       from '@ngx-translate/core';
import { ToastrService }                          from 'ngx-toastr';
import { v4 as uuidv4 }                           from 'uuid';

@Component({
  selector: 'app-crear-producto',
  templateUrl: './crear-producto.component.html',
  styleUrls: ['./crear-producto.component.scss'],
})
export class CrearProductoComponent implements OnDestroy {

  form: FormGroup = this.fb.group({
    isFree:            new FormControl('', [required()] ),
    name:              new FormControl('', [required()] ),
    description:       new FormControl('', [required()] ),
    longDescription: new FormControl('', [required()] ),
    price:            new FormControl('', [requiredAndNumeric()] ),
    pr:          new FormControl('', [requiredAndNumeric()] ),
  });

  pictureUlrFile:string = '';
  pictureGallery: string[] = [];

  subscription!: Subscription;
  availableTags:   string[] = [];
  selectedTagList: string[] = [];

  isKeyboardOpen = false;
  keyboardSub!: Subscription;


  constructor(
    private fb: FormBuilder,
    private productosService: ProductosService,
    private keyboardService: KeyboardService,
    private modalController: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private cameraService: CameraService,
    private translate: TranslateService,
    private toastr: ToastrService,
    private uploadService: UploadService
  ) {
    this.productosService.getAllTags().subscribe();
    this.subscription = this.productosService.tags().subscribe({
      next: (event) => { this.availableTags = event; }
    });
    this.keyboardSub = this.keyboardService.isKeyboardOpen$.subscribe(isOpen => {
      this.isKeyboardOpen = isOpen;
    });
  }
  ngOnDestroy() {
    if (this.keyboardSub) this.keyboardSub.unsubscribe();
    if (this.subscription) this.subscription.unsubscribe();
  }
  onCancel() {
    this.modalController.dismiss();
  }
  onOptionChange(event: Event): void {
    const selectedValue = (event.target as HTMLInputElement).value;
    if (selectedValue === 'free') {
      this.form.controls['price'].disable();
      this.form.controls['price'].setValue('0,00');
      this.form.controls['pr'].disable();
      this.form.controls['pr'].setValue('0');
    }
    if (selectedValue === 'pay') {
      this.form.controls['price'].enable();
      this.form.controls['price'].setValue('');
      this.form.controls['pr'].enable();
      this.form.controls['pr'].setValue('');
    }
    this.form.controls['price'].updateValueAndValidity();
    this.form.controls['pr'].updateValueAndValidity();
  }

  onTagsSelected(tags: string[]) {
    this.selectedTagList = tags;
  }

  async openPhotoOptions(type: boolean) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Scattare una foto',
      mode: 'ios',
      buttons: [
        {
          text: 'Fotocamera',
          icon: 'camera',
          handler: async () => {
            await actionSheet.dismiss();
            this.processPhoto(CameraSource.Camera, type);
          }
        },
        {
          text: 'Galleria',
          icon: 'image',
          handler: async () => {
            await actionSheet.dismiss();
            this.processPhoto(CameraSource.Photos, type);
          }
        },
        {
          text: 'Cerca',
          icon: 'search',
          handler: async () => {
            await actionSheet.dismiss();
            this.searchGallery(type)
          }
        },
        { text: 'Cancelar', icon: 'close', role: 'cancel' }
      ]
    });

    await actionSheet.present();
  }

  async searchGallery(type: boolean) {
    const modal = await this.modalController.create({
      component: ModalGalleryComponent,
      componentProps: {
        pathImg: 'products'
      },
      cssClass: ['radius-modals', 'modal-95vh'],
      breakpoints: [0,1],
      initialBreakpoint: 1,
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data) {
      this.uploadPicture(data.blob, data.filePath, type);
    }
  }

  processPhoto(camera: CameraSource, _type: boolean) {
    this.cameraService.getPhoto(camera).then(({ imageUrl, file }) => {
      const arrayTypeFile = file!.type.split('/');
      const type = arrayTypeFile[1];
      const path = `passaparola/products/${uuidv4()}.${type}`;
      this.uploadPicture(file, path, _type);
    })
    .catch((err) => console.error(err) );
  }

  async uploadPicture(pictureFile: any, path: string, type: boolean) {
    const fileUpload: any = await this.uploadService.uploadFile(pictureFile!, path);
    if (!fileUpload) {
      this.toastr.error(
        this.translate.instant('BUSINESS_SUGGESTION.ERROR_UP_IMG')
      );
      return;
    }
    if (type) this.pictureGallery.push(fileUpload);
    else this.pictureUlrFile = fileUpload;
  }

  eliminar(type: boolean, img = '') {
    if(!type) {
      this.pictureUlrFile = '';
      return;
    }
    this.pictureGallery = this.pictureGallery.filter(imagen => img);
  }

  crearProducto() {
    let producto = {
      isFree: (this.form.controls['isFree'].value == 'pay') ? false : true,
      pictureUlrFile: this.pictureUlrFile,
      pictureGallery: this.pictureGallery,
      name: this.form.controls['name'].value,
      description: this.form.controls['description'].value,
      longDescription: this.form.controls['longDescription'].value,
      price: Number(this.form.controls['price'].value.toString().replace(',', '.')),
      pr: Number(this.form.controls['pr'].value.toString().replace(',', '.')),
      tags: this.selectedTagList,
    }
    this.productosService.createProducts(producto).subscribe({
      next: () => this.modalController.dismiss()
    })
  }


}
