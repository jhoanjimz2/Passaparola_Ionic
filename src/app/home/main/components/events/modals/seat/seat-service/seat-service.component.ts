import { Component, Input, OnDestroy }                                                               from '@angular/core';
import { FormBuilder, FormControl, FormGroup }                                                       from '@angular/forms';
import { CameraSource }                                                                              from '@capacitor/camera';
import { ModalController }                                                                           from '@ionic/angular';
import { TranslateService }                                                                          from '@ngx-translate/core';
import { ToastrService }                                                                             from 'ngx-toastr';
import { Subscription }                                                                              from 'rxjs';
import { Events, Product }                                                                           from 'src/app/shared/interfaces/events/events';
import { EventsService, UploadService }                                                              from 'src/app/shared/services';
import { CameraService }                                                                             from 'src/app/shared/services/camera.service';
import { KeyboardService }                                                                           from 'src/app/shared/services/keyboard.service';
import { required, requiredAndNumeric, requiredAndNumericMin10 }                                     from 'src/app/shared/validators/events.validator';
import { v4 as uuidv4 }                                                                              from 'uuid';

@Component({
  selector: 'app-seat-service',
  templateUrl: './seat-service.component.html',
  styleUrls: ['./seat-service.component.scss'],
})
export class SeatServiceComponent implements OnDestroy {
  @Input() product!: Product;
  @Input() idProduct!: string;

  imgUrl: string = '';

  form: FormGroup = this.fb.group({
    description:   new FormControl('', [required()] ),
    option:        new FormControl('', [required()] ),
    name:          new FormControl('', [required()] ),
    pr:            new FormControl('', [requiredAndNumericMin10()] ),
    price:         new FormControl('', [requiredAndNumeric()]),
    quantity:      new FormControl('', [requiredAndNumeric()] ),
    quantityOffer: new FormControl('', [requiredAndNumeric()] ),
    offerValue:    new FormControl('', [requiredAndNumeric()] ),
    discount:      new FormControl('', [requiredAndNumeric()] ),
    offerPrice:    new FormControl('', [requiredAndNumeric()] ),
  });

  get typeCheck() { return this.form.controls['option'].value }

  private subscription!: Subscription;
  eventProfile: Events = {} as Events;

  isKeyboardOpen = false;
  private keyboardSub!: Subscription;

  constructor(
    private fb: FormBuilder,
    private modalController: ModalController,
    private eventsService: EventsService,
    private cameraService: CameraService,
    private translate: TranslateService,
    private toastr: ToastrService,
    private uploadService: UploadService,
    private keyboardService: KeyboardService
  ) {
    this.subscription = this.eventsService.obtenerEventSelect().subscribe({
      next: (event) => { this.eventProfile = structuredClone(event); }
    });
    this.keyboardSub = this.keyboardService.isKeyboardOpen$.subscribe(isOpen => {
      this.isKeyboardOpen = isOpen;
    });
  }
  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
    if (this.keyboardSub) this.keyboardSub.unsubscribe();
  }


  onCancel() { this.modalController.dismiss() }

  onOptionChange(event: Event): void {
    const selectedValue = (event.target as HTMLInputElement).value;
    if (selectedValue === 'free') {
      this.form.controls['discount'].disable();
      this.form.controls['discount'].setValue(100);
    }
    if (selectedValue === 'pay') {
      this.form.controls['discount'].enable();
      this.form.controls['discount'].setValue('');
    }
    this.form.controls['discount'].updateValueAndValidity();
    this.setValues();
  }

  setValues() {
    const price = parseFloat(this.form.controls["price"].value?.toString().replace(',', '.')) || 0;
    const quantityOffer = parseFloat(this.form.controls["quantityOffer"].value?.toString().replace(',', '.')) || 0;
    const discount = parseFloat(this.form.controls["discount"].value?.toString().replace(',', '.')) || 0;

    const offerValue = price * quantityOffer;
    const offerPrice = offerValue - (offerValue * discount / 100);

    this.form.controls["offerValue"].setValue(offerValue.toLocaleString('de-DE', { minimumFractionDigits: 2 }));
    this.form.controls["offerPrice"].setValue(offerPrice.toLocaleString('de-DE', { minimumFractionDigits: 2 }));
  }



  takePicture() {
    this.cameraService.getPhoto(CameraSource.Prompt).then(({ imageUrl, file }) => {
      const arrayTypeFile = file!.type.split('/');
      const type = arrayTypeFile[1];
      const path = `passaparola/events/cover/${uuidv4()}.${type}`;
      this.imgUrl = imageUrl!;
      this.uploadPicture(file, path);
    })
    .catch((err) => console.error(err) );
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


  updateCreateProduct() {
    this.eventsService.createProductEvent({
      name:              this.form.controls['name'].value,
      pr:                this.form.controls['pr'].value,
      description:       this.form.controls['description'].value,
      price:             (this.form.controls['option'].value == 'pay') ? this.form.controls['price'].value : 0,
      isFree:            (this.form.controls['option'].value == 'pay') ? false : true,
      quantity:          this.form.controls['quantity'].value,
      quantityOffer:     this.form.controls['quantityOffer'].value,
      offerValue:        this.form.controls['offerValue'].value,
      pictureUlrFile:    this.imgUrl,
      ...(this.idProduct ? { id: this.idProduct } : {}),
      discount:          this.form.controls['discount'].value,
      offerPrice:        this.form.controls['offerPrice'].value,
      event:            { id: this.eventProfile.id! }
    })
    .subscribe({ next:() => {
      this.eventsService.getProductToIdEventToProfile(this.eventProfile.id!).subscribe({
        next: () => this.modalController.dismiss()
      });
    }})
  }

  deleteProduct() {
    this.eventsService.deletProductEventToId(this.idProduct)
    .subscribe({ next:() => {
      this.eventsService.getProductToIdEventToProfile(this.eventProfile.id!).subscribe({
        next: () => this.modalController.dismiss()
      });
    }})
  }

}


