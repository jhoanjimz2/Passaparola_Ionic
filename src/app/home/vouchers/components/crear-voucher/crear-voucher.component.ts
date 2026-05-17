import { Component, OnDestroy, OnInit }                                            from '@angular/core';
import { FormBuilder, FormControl, FormGroup }                                     from '@angular/forms';
import { CameraSource }                                                            from '@capacitor/camera';
import { ActionSheetController, ModalController }                                  from '@ionic/angular';
import { TranslateService }                                                        from '@ngx-translate/core';
import { ToastrService }                                                           from 'ngx-toastr';
import { Subscription }                                                            from 'rxjs';
import { ModalGalleryComponent }                                                   from 'src/app/components/modal-gallery/modal-gallery.component';
import { Voucher }                                                                 from 'src/app/shared/interfaces/vouchers/vouchers';
import { ProductosService, UploadService, VouchersService }                        from 'src/app/shared/services';
import { CameraService }                                                           from 'src/app/shared/services/camera.service';
import { required, requiredAndNumeric }                                            from 'src/app/shared/validators/events.validator';
import { v4 as uuidv4 }                                                            from 'uuid';
@Component({
  selector: 'app-crear-voucher',
  templateUrl: './crear-voucher.component.html',
  styleUrls: ['./crear-voucher.component.scss'],
})
export class CrearVoucherComponent implements OnInit, OnDestroy {

  form: FormGroup = this.fb.group({
    name:          new FormControl('', [required()] ),
    description:   new FormControl('', [required()] ),

    quantityOffer: new FormControl('', [requiredAndNumeric()] ),
    offerValue:    new FormControl({ value: this.calculateOfferValue(), disabled: true }, [requiredAndNumeric()] ),
    discount:      new FormControl('', [requiredAndNumeric()] ),
    offerPrice:    new FormControl({ value: this.calculateOfferPrice(0), disabled: true }, [requiredAndNumeric()] ),

    dateTo:        new FormControl('', [required()]),
  });

  imgUrl: string = '';

  minDate: string = new Date().toISOString().split('T')[0];

  subscription!: Subscription;
  productos: any[] = [];


  constructor(
    private fb: FormBuilder,
    private modalController: ModalController,
    private cameraService: CameraService,
    private translate: TranslateService,
    private toastr: ToastrService,
    private uploadService: UploadService,
    private productosService: ProductosService,
    private actionSheetCtrl: ActionSheetController
  ) {
    this.subscription = this.productosService.selectProducts().subscribe({
      next: (products) => {
        this.productos = products;
        this.actualizarPrecios();
      }
    });
  }

  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
  }

  ngOnInit() {
    this.form.get('discount')!.valueChanges.subscribe(value => {
      if (!value) return;
      const parsedValue = parseFloat(value.toString().replace(',', '.'));
      if (!isNaN(parsedValue)) {
        this.updatePrices(parsedValue);
      }
    });
    this.updatePrices(0);
  }

  onCancel() { this.modalController.dismiss() }

  actualizarPrecios() {
    const discount = parseFloat(this.form.get('discount')?.value?.toString().replace(',', '.') || '0');
    this.updatePrices(discount);
  }
  calculateOfferValue(): number {
    return this.productos?.reduce((sum, item) => sum + (item.value || 0), 0) || 0;
  }
  calculateOfferPrice(discount: number): number {
    const total = this.calculateOfferValue();
    return total - (total * (discount / 100));
  }
  updatePrices(discount: number) {
    const offerValue = this.calculateOfferValue();
    const offerPrice = this.calculateOfferPrice(discount);

    this.form.patchValue(
      { offerValue: null, offerPrice: null },
      { emitEvent: false }
    );

    this.form.patchValue(
      {
        offerValue: offerValue.toString().replace('.', ','),
        offerPrice: offerPrice.toString().replace('.', ','),
      },
      { emitEvent: false }
    );
  }



















  createVoucher() {
    // let voucher: Voucher = {
    // }
    // this.vouchersServices.createVoucher(voucher).subscribe({
    //   next: () => this.modalController.dismiss(),
    //   error: () => this.modalController.dismiss()
    // })
  }

  deleteVoucher() {}

  async openPhotoOptions() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Scattare una foto',
      mode: 'ios',
      buttons: [
        {
          text: 'Fotocamera',
          icon: 'camera',
          handler: async () => {
            await actionSheet.dismiss();
            this.processPhoto(CameraSource.Camera);
          }
        },
        {
          text: 'Galleria',
          icon: 'image',
          handler: async () => {
            await actionSheet.dismiss();
            this.processPhoto(CameraSource.Photos);
          }
        },
        {
          text: 'Cerca',
          icon: 'search',
          handler: async () => {
            await actionSheet.dismiss();
            this.searchGallery()
          }
        },
        { text: 'Cancelar', icon: 'close', role: 'cancel' }
      ]
    });

    await actionSheet.present();
  }

  processPhoto(camera: CameraSource) {
    this.cameraService.getPhoto(camera).then(({ imageUrl, file }) => {
      const arrayTypeFile = file!.type.split('/');
      const type = arrayTypeFile[1];
      const path = `passaparola/events/cover/${uuidv4()}.${type}`;
      this.uploadPicture(file, path);
    })
    .catch((err) => console.error(err) );
  }

  async searchGallery() {
    const modal = await this.modalController.create({
      component: ModalGalleryComponent,
      componentProps: {
        pathImg: 'vouchers'
      },
      cssClass: ['radius-modals', 'modal-95vh'],
      breakpoints: [0,1],
      initialBreakpoint: 1,
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data) {
      this.uploadPicture(data.blob, data.filePath);
    }
  }
  async uploadPicture(pictureFile: any, path: string) {
    const fileUpload: any = await this.uploadService.uploadFile(pictureFile!, path);
    if (!fileUpload) {
      this.toastr.error(
        this.translate.instant('BUSINESS_SUGGESTION.ERROR_UP_IMG')
      );
      return;
    }
    this.imgUrl = fileUpload!;
  }

}
