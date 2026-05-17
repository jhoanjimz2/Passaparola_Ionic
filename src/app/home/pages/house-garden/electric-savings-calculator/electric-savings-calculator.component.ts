import { Component, OnInit, OnDestroy }                                         from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonIcon, IonRadio, IonRadioGroup }                         from "@ionic/angular/standalone";
import { TranslateService }                                                     from '@ngx-translate/core';
import { ToastrService }                                                        from 'ngx-toastr';
import { ComponentModule }                                                      from 'src/app/components/component.module';
import { UploadService }                                                        from 'src/app/shared/services';
import { CameraService }                                                        from 'src/app/shared/services/camera.service';
import { CameraSource }                                                         from '@capacitor/camera';
import { v4 as uuidv4 }                                                         from 'uuid';
import { CommonModule }                                                         from '@angular/common';
import { HomeGardenService }                                                    from 'src/app/shared/services/home-garden.service';

@Component({
  selector: 'app-electric-savings-calculator',
  templateUrl: './electric-savings-calculator.component.html',
  styleUrls: ['./electric-savings-calculator.component.scss'],
  standalone: true,
  imports: [
    ComponentModule,
    IonContent,
    IonIcon,
    IonRadioGroup,
    IonRadio,
    ReactiveFormsModule,
    CommonModule
  ]
})
export class ElectricSavingsCalculatorComponent implements OnInit, OnDestroy {

  // Estados
  billUploaded: boolean = false;
  analysisRequested: boolean = false;
  loadingBill: boolean = false;
  urlBill: string = '';

  // Countdown
  hours: number = 72;
  minutes: number = 0;
  seconds: number = 0;
  private countdownInterval: any;

  // Formulario
  analysisForm: FormGroup = this.formBuilder.group({
    schedule: new FormControl('', [Validators.required]),
    acceptTerms: new FormControl(false, [Validators.requiredTrue])
  });

  constructor(
    private uploadService: UploadService,
    private cameraService: CameraService,
    private translate: TranslateService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private homeGardenService: HomeGardenService
  ) {}

  ngOnInit() {
    // Aquí podrías cargar datos guardados previamente
    this.checkExistingAnalysis();
  }

  ngOnDestroy() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  // Verificar si ya existe un análisis en progreso
  checkExistingAnalysis() {
    // Aquí podrías consultar al backend si hay un análisis en curso
    // Por ahora, verificamos localStorage como ejemplo
    const savedAnalysis = localStorage.getItem('electricAnalysis');
    if (savedAnalysis) {
      const data = JSON.parse(savedAnalysis);
      if (data.analysisRequested) {
        this.analysisRequested = true;
        this.billUploaded = true;
        this.urlBill = data.billUrl;
        this.analysisForm.patchValue({
          schedule: data.schedule,
          acceptTerms: data.acceptTerms
        });
        this.analysisForm.disable();

        // Calcular tiempo restante
        const endTime = new Date(data.endTime).getTime();
        this.startCountdown(endTime);
      }
    }
  }

  // Subir imagen de la boleta
  uploadBillImage() {
    if (this.analysisRequested) return; // No permitir si ya se solicitó análisis

    this.loadingBill = true;
    this.cameraService.getPhoto(CameraSource.Prompt).then(({ imageUrl, file }) => {
      const arrayTypeFile = file!.type.split('/');
      const type = arrayTypeFile[1];
      const path = `passaparola/electric-bills/${uuidv4()}.${type}`;
      this.uploadBillFile(file, path);
    })
    .catch((err) => {
      console.error(err);
      this.loadingBill = false;
    });
  }

  async uploadBillFile(billFile: any, path: string) {
    const fileUpload: any = await this.uploadService.uploadFile(billFile!, path);

    if (!fileUpload) {
      this.toastr.error('Errore nel caricamento del documento');
      this.loadingBill = false;
      return;
    }

    this.urlBill = fileUpload.url || fileUpload;
    this.billUploaded = true;
    this.loadingBill = false;
    this.toastr.success('Documento caricato con successo');
  }

  // Solicitar análisis gratuito
  requestAnalysis() {
    this.analysisForm.markAllAsTouched();

    if (!this.billUploaded) {
      this.toastr.error('Devi prima caricare la tua ultima bolletta');
      return;
    }

    if (this.analysisForm.invalid) {
      this.toastr.error('Completa tutti i campi obbligatori');
      return;
    }

    const formValue = this.analysisForm.value;

    const analysisData = {
      urlFile: this.urlBill,
      schedule: formValue.schedule,
      status: true,
      typeService: 'energy',
      serviceCompanyName: 'Legal Experts Inc.'
    };

    this.homeGardenService.analysis(analysisData).subscribe({
      next: () => this.saveAnalysisRequest(analysisData)
    })
  }

  saveAnalysisRequest(data: any) {
    this.analysisRequested = true;
    this.analysisForm.disable();

    // Calcular tiempo de finalización (72 horas desde ahora)
    const endTime = new Date().getTime() + (72 * 60 * 60 * 1000);

    // Guardar en localStorage (en producción esto vendría del backend)
    const analysisInfo = {
      ...data,
      analysisRequested: true,
      endTime: endTime,
      requestDate: new Date().toISOString()
    };

    localStorage.setItem('electricAnalysis', JSON.stringify(analysisInfo));

    // Iniciar cuenta regresiva
    this.startCountdown(endTime);

    this.toastr.success('Richiesta inviata con successo! Ti contatteremo presto.');
  }

  startCountdown(endTime: number) {
    this.updateCountdown(endTime);

    this.countdownInterval = setInterval(() => {
      this.updateCountdown(endTime);
    }, 1000);
  }

  updateCountdown(endTime: number) {
    const now = new Date().getTime();
    const distance = endTime - now;

    if (distance < 0) {
      clearInterval(this.countdownInterval);
      this.hours = 0;
      this.minutes = 0;
      this.seconds = 0;
      return;
    }

    this.hours = Math.floor(distance / (1000 * 60 * 60));
    this.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    this.seconds = Math.floor((distance % (1000 * 60)) / 1000);
  }

  hasError(fieldName: string): boolean {
    const field = this.analysisForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.analysisForm.get(fieldName);
    if (field?.hasError('required') || field?.hasError('requiredTrue')) {
      return 'Campo obbligatorio';
    }
    return '';
  }
}
