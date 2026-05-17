import { Component, EventEmitter, Input, Output }                               from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CameraSource }                                                         from '@capacitor/camera';
import { IonIcon }                                                              from '@ionic/angular/standalone';
import { TranslateService }                                                     from '@ngx-translate/core';
import { ToastrService }                                                        from 'ngx-toastr';
import { Contract }                                                             from 'src/app/shared/interfaces/contract/contract';
import { UploadService }                                                        from 'src/app/shared/services';
import { CameraService }                                                        from 'src/app/shared/services/camera.service';
import { v4 as uuidv4 }                                                         from 'uuid';
import { CommonModule }                                                         from '@angular/common';

@Component({
  selector: 'app-form-supply-contract',
  templateUrl: './form-supply-contract.component.html',
  styleUrls: ['./form-supply-contract.component.scss'],
  standalone: true,
  imports: [
    IonIcon,
    ReactiveFormsModule,
    CommonModule
  ]
})
export class FormSupplyContractComponent {
  @Input() contract: Contract = {} as Contract;
  @Output() save_data = new EventEmitter<any>();

  // URLs de las imágenes subidas
  urlFrontIdDoc: string = '';
  urlBackIdDoc: string = '';
  urlTaxIdDoc: string = '';
  urlLastBill: string = '';

  // Estados de carga
  loadingFront: boolean = false;
  loadingBack: boolean = false;
  loadingTaxId: boolean = false;
  loadingBill: boolean = false;

  formDocuments: FormGroup = this.formBuilder.group({
    place: new FormControl('', [Validators.required]),
    registrationDate: new FormControl('', [Validators.required]),
    termsAcceptance1: new FormControl(false, [Validators.requiredTrue]),
    termsAcceptance2: new FormControl(false, [Validators.requiredTrue]),
    termsAcceptance3: new FormControl(false, [Validators.requiredTrue]),
  });

  constructor(
    private uploadService: UploadService,
    private cameraService: CameraService,
    private translate: TranslateService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    // this.fillTestData()
  }

  // Tomar foto del frente del documento
  takePictureFront() {
    this.loadingFront = true;
    this.cameraService.getPhoto(CameraSource.Prompt).then(({ imageUrl, file }) => {
      const arrayTypeFile = file!.type.split('/');
      const type = arrayTypeFile[1];
      const path = `passaparola/contract/id-front/${uuidv4()}.${type}`;
      this.uploadPicture(file, path, 'front');
    })
    .catch((err) => {
      console.error(err);
      this.loadingFront = false;
    });
  }

  // Tomar foto del reverso del documento
  takePictureBack() {
    this.loadingBack = true;
    this.cameraService.getPhoto(CameraSource.Prompt).then(({ imageUrl, file }) => {
      const arrayTypeFile = file!.type.split('/');
      const type = arrayTypeFile[1];
      const path = `passaparola/contract/id-back/${uuidv4()}.${type}`;
      this.uploadPicture(file, path, 'back');
    })
    .catch((err) => {
      console.error(err);
      this.loadingBack = false;
    });
  }

  // Tomar foto del código fiscal
  takePictureTaxId() {
    this.loadingTaxId = true;
    this.cameraService.getPhoto(CameraSource.Prompt).then(({ imageUrl, file }) => {
      const arrayTypeFile = file!.type.split('/');
      const type = arrayTypeFile[1];
      const path = `passaparola/contract/tax-id/${uuidv4()}.${type}`;
      this.uploadPicture(file, path, 'taxId');
    })
    .catch((err) => {
      console.error(err);
      this.loadingTaxId = false;
    });
  }

  // Tomar foto de la última boleta
  takePictureBill() {
    this.loadingBill = true;
    this.cameraService.getPhoto(CameraSource.Prompt).then(({ imageUrl, file }) => {
      const arrayTypeFile = file!.type.split('/');
      const type = arrayTypeFile[1];
      const path = `passaparola/contract/bill/${uuidv4()}.${type}`;
      this.uploadPicture(file, path, 'bill');
    })
    .catch((err) => {
      console.error(err);
      this.loadingBill = false;
    });
  }

  async uploadPicture(pictureFile: any, path: string, type: 'front' | 'back' | 'taxId' | 'bill') {
    const fileUpload: any = await this.uploadService.uploadFile(pictureFile!, path);

    if (!fileUpload) {
      this.toastr.error(
        this.translate.instant('BUSINESS_SUGGESTION.ERROR_UP_IMG')
      );
      this.resetLoading(type);
      return;
    }

    // Asignar la URL según el tipo de documento
    switch (type) {
      case 'front':
        this.urlFrontIdDoc = fileUpload.url || fileUpload;
        this.loadingFront = false;
        break;
      case 'back':
        this.urlBackIdDoc = fileUpload.url || fileUpload;
        this.loadingBack = false;
        break;
      case 'taxId':
        this.urlTaxIdDoc = fileUpload.url || fileUpload;
        this.loadingTaxId = false;
        break;
      case 'bill':
        this.urlLastBill = fileUpload.url || fileUpload;
        this.loadingBill = false;
        break;
    }

    this.toastr.success('Documento caricato con successo');
  }

  resetLoading(type: 'front' | 'back' | 'taxId' | 'bill') {
    switch (type) {
      case 'front':
        this.loadingFront = false;
        break;
      case 'back':
        this.loadingBack = false;
        break;
      case 'taxId':
        this.loadingTaxId = false;
        break;
      case 'bill':
        this.loadingBill = false;
        break;
    }
  }

  // Función para rellenar datos de prueba
  fillTestData() {
    this.formDocuments.patchValue({
      place: 'Roma',
      registrationDate: '05/11/2025',
      termsAcceptance1: true,
      termsAcceptance2: true,
      termsAcceptance3: true
    });
  }

  onSubmit() {
    this.formDocuments.markAllAsTouched();

    // Validar que todos los documentos estén subidos
    if (!this.urlFrontIdDoc || !this.urlBackIdDoc || !this.urlTaxIdDoc || !this.urlLastBill) {
      this.toastr.error('Devi caricare tutti i documenti richiesti');
      return;
    }

    if (this.formDocuments.valid) {
      const formValue = this.formDocuments.value;

      const formattedData = {
        urlFrontIdDoc: this.urlFrontIdDoc,
        urlBackIdDoc: this.urlBackIdDoc,
        urlTaxIdDoc: this.urlTaxIdDoc,
        lastBill: this.urlLastBill,
        place: formValue.place,
        registrationDate: formValue.registrationDate
      };

      this.save_data.emit({
        data: formattedData,
        step: 4,
        loadService: true
      });
    } else {
      const firstInvalidControl = this.getFirstInvalidControl();
      if (firstInvalidControl) {
        firstInvalidControl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      this.toastr.error('Completa tutti i campi obbligatori');
    }
  }

  private getFirstInvalidControl(): HTMLElement | null {
    const invalidControl = Object.keys(this.formDocuments.controls).find(key =>
      this.formDocuments.get(key)?.invalid
    );
    if (invalidControl) {
      return document.querySelector(`[name="${invalidControl}"]`);
    }
    return null;
  }

  hasError(fieldName: string): boolean {
    const field = this.formDocuments.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.formDocuments.get(fieldName);
    if (field?.hasError('required') || field?.hasError('requiredTrue')) {
      return 'Campo obbligatorio';
    }
    return '';
  }
}
