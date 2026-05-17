import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewChildren,
  ElementRef,
  QueryList
}                                                           from '@angular/core';
import { IonContent, IonIcon, IonSelect, IonSelectOption }                from '@ionic/angular/standalone';
import { CommonModule, Location }                                         from '@angular/common';
import { ReactiveFormsModule,
         FormBuilder, FormControl,
         FormGroup, Validators }                           from '@angular/forms';
import { HttpClient }                                                     from '@angular/common/http';
import { ActivatedRoute }                                                 from '@angular/router';
import { Subscription }                                                   from 'rxjs';
import { TranslateService }                                               from '@ngx-translate/core';
import { NgxExtendedPdfViewerModule }                                     from 'ngx-extended-pdf-viewer';
import { NgCircleProgressModule }                                         from 'ng-circle-progress';
import { v4 as uuidv4 }                                                   from 'uuid';

import { ComponentModule }                                                from 'src/app/components/component.module';
import { SafePipe }                                                       from 'src/app/shared/pipes/safe.pipe';
import { CountryService, SmsCodeService, PlatformService, UploadService } from 'src/app/shared/services';
import { Country }                                                        from 'src/app/shared/interfaces/country/country.interface';
import { SmsSendCodeRequest }                                             from 'src/app/shared/interfaces/sms-code/request/sms-send-code-request.interface';
import { environment }                                                    from 'src/environments/environment';
import { Contract }                                                       from 'src/app/shared/interfaces/contract/contract.interface';
import { ContractService, ContractSignPayload }                           from 'src/app/shared/services/contract.service';

/**
 * FLUJO:
 *  step 0 — PDF + aceptación
 *  step 1 — Frente documento
 *  step 2 — Reverso documento
 *  step 3 — Selfie
 *  step 4 — Verificación OTP
 *  step 5 — Éxito
 */
@Component({
  selector: 'app-view-contract',
  templateUrl: './view-contract.page.html',
  styleUrls: ['./view-contract.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonIcon, IonSelect, IonSelectOption,
    CommonModule,
    ReactiveFormsModule,
    ComponentModule,
    SafePipe,
    NgxExtendedPdfViewerModule,
    NgCircleProgressModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ViewContractPage implements OnInit, OnDestroy {

  // ── Route ──────────────────────────────────────────────
  private contractId = '';

  // ── View refs ──────────────────────────────────────────
  @ViewChild('videoElement')  videoElement!:  ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement') canvasElement!: ElementRef<HTMLCanvasElement>;
  @ViewChildren('codeInput')  codeInputs!:    QueryList<ElementRef<HTMLInputElement>>;

  // ── Contract ───────────────────────────────────────────
  contract:          Contract | null = null;
  isLoadingContract  = true;

  // FIX 1: La URL del PDF se muestra en un <iframe> nativo.
  // Los iframes no están sujetos a la política CORS como los XHR/fetch,
  // por lo que el browser carga el PDF directamente sin bloqueo.
  pdfUrl: string = '';

  isReadonly         = false;
  readonlyReason:    'signed' | 'approved' | 'rejected' | null = null;

  // ── Steps ──────────────────────────────────────────────
  step = 0;

  // step 0
  termsAccepted      = false;
  conditionsAccepted = false;

  // steps 1-2
  frontDocumentPhoto: string | null = null;
  backDocumentPhoto:  string | null = null;

  // step 3
  selfiePhoto:    string | null = null;
  isFaceDetected  = false;

  // camera (shared steps 1-3)
  isCameraActive        = false;
  isCameraLoading       = false;
  mediaStream:          MediaStream | null = null;
  faceDetectionInterval: any = null;

  // step 4 — countries
  countries:           Country[] = [];
  selectedCountryCode  = 'IT';
  phonePrefix          = '+39';
  phoneNumber          = '';

  // step 4 — SMS
  smsCodeId            = '';
  smsCodeRead          = false;
  smsCodeSuscription:  Subscription | undefined;

  // step 4 — OTP form
  formCode: FormGroup = this.fb.group({
    code1: new FormControl('', [Validators.required]),
    code2: new FormControl('', [Validators.required]),
    code3: new FormControl('', [Validators.required]),
    code4: new FormControl('', [Validators.required]),
    code5: new FormControl('', [Validators.required]),
    code6: new FormControl('', [Validators.required]),
  });
  pinCount = 0;

  // step 4 — timer
  minutes  = 1;
  seconds  = 0;
  duration = 60;
  timer    = 60;
  percent  = 0;
  timeCheck: any = null;

  // submit
  isSubmitting = false;

  constructor(
    public  location:        Location,
    private route:           ActivatedRoute,
    private contractService: ContractService,
    private uploadService:   UploadService,
    private countryService:  CountryService,
    private smsCodeService:  SmsCodeService,
    private platformService: PlatformService,
    private translate:       TranslateService,
    private http:            HttpClient,
    private fb:              FormBuilder,
  ) {}

  // ============================================================
  // LIFECYCLE
  // ============================================================

  ngOnInit(): void {
    this.contractId = this.route.snapshot.paramMap.get('id') ?? '';
    this.loadContract();
    this.getCountries();

    this.smsCodeService.smsCodeSet(null);
    this.smsCodeSuscription = this.smsCodeService.smsCodeWatch().subscribe({
      next: (code) => { if (code) { this.smsCodeRead = true; this.setCode(code); } }
    });
  }

  ngOnDestroy(): void {
    this.stopCamera();
    this.cleanTime();
    this.smsCodeService.smsCodeSet(null);
    this.smsCodeSuscription?.unsubscribe();
  }

  // ============================================================
  // CONTRACT LOAD
  // ============================================================

  loadContract(): void {
    this.isLoadingContract = true;
    this.contractService.getById(this.contractId).subscribe({
      next: (contract) => {
        this.contract          = contract;
        this.isLoadingContract = false;

        // FIX 1: Asignar la URL directamente — el iframe la carga sin CORS
        this.pdfUrl = contract.documentUrl;

        // FIX 2: Pre-llenar el teléfono desde localStorage (appPassaparola_user)
        this.prefillPhoneFromStorage();

        if (['signed', 'approved', 'rejected'].includes(contract.status)) {
          this.isReadonly     = true;
          this.readonlyReason = contract.status as 'signed' | 'approved' | 'rejected';
        }
      },
      error: () => { this.isLoadingContract = false; }
    });
  }

  // FIX 2: Pre-llena el teléfono del usuario.
  // Prioridad:
  //   1. contract.user.phoneNumber + contract.user.country.phonePrefix  (viene del getById)
  //   2. localStorage 'appPassaparola_user' como fallback
  private prefillPhoneFromStorage(): void {
    // Fuente primaria: datos del contrato (getById ya los devuelve)
    // ContractUser tiene: phoneNumber, country.phonePrefix, country.code
    if (this.contract?.user) {
      const u = this.contract.user;
      if (u.phoneNumber) {
        this.phoneNumber = u.phoneNumber;                                        // "3502295047"
      }
      if (u.country?.phonePrefix) {
        this.phonePrefix         = u.country.phonePrefix;                       // "+57"
        this.selectedCountryCode = u.country.code ?? this.selectedCountryCode; // "CO"
      }
      if (this.phoneNumber) return; // ya tenemos lo que necesitamos
    }

    // Fallback: localStorage
    try {
      const raw = localStorage.getItem('appPassaparola_user');
      if (!raw) return;
      const user = JSON.parse(raw);
      if (user?.phoneNumber)        this.phoneNumber        = user.phoneNumber;
      if (user?.country?.phonePrefix) {
        this.phonePrefix         = user.country.phonePrefix;
        this.selectedCountryCode = user.country.code ?? this.selectedCountryCode;
      }
    } catch {
      console.warn('No se pudo leer el teléfono desde localStorage');
    }
  }

  // ============================================================
  // STEP 0 — ACCEPTANCE
  // ============================================================

  onTermsChange(event: any):      void { this.termsAccepted      = event.target.checked; }
  onConditionsChange(event: any): void { this.conditionsAccepted = event.target.checked; }
  canSignContract():              boolean { return this.termsAccepted && this.conditionsAccepted; }

  signContract(): void {
    if (!this.canSignContract()) return;
    this.step = 1;
    setTimeout(() => this.startCamera(), 300);
  }

  downloadContract(): void {
    if (!this.contract?.documentUrl) return;
    // Abrir la URL directamente en una nueva pestaña — el browser gestiona la descarga
    // sin pasar por HttpClient (que fallaría por CORS en dominios externos)
    const link     = document.createElement('a');
    link.href      = this.contract.documentUrl;
    link.target    = '_blank';
    link.download  = 'Contratto.pdf';
    link.click();
  }

  onPdfLoaded():           void { /* interceptor handles loading */ }
  onPdfLoadError(_e: any): void { /* interceptor handles errors  */ }

  // ============================================================
  // CAMERA — shared steps 1, 2, 3
  // ============================================================

  async startCamera(): Promise<void> {
    try {
      this.isCameraLoading = true;
      const facingMode = this.step === 3 ? 'user' : 'environment';
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      });
      if (this.videoElement) {
        this.videoElement.nativeElement.srcObject = this.mediaStream;
        this.isCameraActive  = true;
        this.isCameraLoading = false;
        this.videoElement.nativeElement.onloadedmetadata = () => {
          this.videoElement.nativeElement.play();
          if (this.step === 3) this.startFaceDetection();
        };
      } else {
        this.isCameraLoading = false;
      }
    } catch {
      this.isCameraLoading = false;
      alert('No se pudo acceder a la cámara. Verifica los permisos.');
    }
  }

  stopCamera(): void {
    this.mediaStream?.getTracks().forEach(t => t.stop());
    this.mediaStream = null;
    if (this.faceDetectionInterval) {
      clearInterval(this.faceDetectionInterval);
      this.faceDetectionInterval = null;
    }
    this.isCameraActive = false;
    this.isFaceDetected = false;
  }

  // ============================================================
  // STEPS 1 & 2 — DOCUMENT CAPTURE
  // ============================================================

  captureDocument(side: 'front' | 'back'): void {
    if (!this.videoElement) return;
    const video  = this.videoElement.nativeElement;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const photo = canvas.toDataURL('image/jpeg', 0.92);
    side === 'front' ? (this.frontDocumentPhoto = photo) : (this.backDocumentPhoto = photo);
    this.stopCamera();
  }

  retakeDocument(side: 'front' | 'back'): void {
    side === 'front' ? (this.frontDocumentPhoto = null) : (this.backDocumentPhoto = null);
    setTimeout(() => this.startCamera(), 100);
  }

  onDocumentUpload(event: Event, side: 'front' | 'back'): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.[0]) return;
    this.readFileAsBase64(input.files[0]).then(b64 => {
      side === 'front' ? (this.frontDocumentPhoto = b64) : (this.backDocumentPhoto = b64);
    });
  }

  goToStep(n: number): void {
    this.stopCamera();
    this.step = n;
    if (n === 1 || n === 2 || n === 3) {
      setTimeout(() => this.startCamera(), 300);
    }
    // FIX 2: Al llegar al step 4, enviar el código automáticamente
    if (n === 4 && this.isPhoneValid() && !this.smsCodeId) {
      setTimeout(() => this.sendSms(), 400);
    }
  }

  // ============================================================
  // STEP 3 — SELFIE
  // ============================================================

  startFaceDetection(): void {
    this.faceDetectionInterval = setInterval(() => this.detectFace(), 500);
  }

  detectFace(): void {
    if (!this.videoElement || !this.canvasElement) return;
    const video  = this.videoElement.nativeElement;
    const canvas = this.canvasElement.nativeElement;
    const ctx    = canvas.getContext('2d');
    if (!ctx || video.readyState !== video.HAVE_ENOUGH_DATA) return;
    canvas.width  = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    // TODO: replace with real face detection (face-api.js / MediaPipe)
    if (!this.isFaceDetected && this.isCameraActive) {
      setTimeout(() => { this.isFaceDetected = true; }, 2000);
    }
  }

  captureSelfie(): void {
    if (!this.isFaceDetected || !this.videoElement) return;
    const video  = this.videoElement.nativeElement;
    const canvas = document.createElement('canvas');
    canvas.width  = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    this.selfiePhoto = canvas.toDataURL('image/jpeg', 0.92);
    this.stopCamera();
  }

  retakeSelfie(): void {
    this.selfiePhoto    = null;
    this.isFaceDetected = false;
    setTimeout(() => this.startCamera(), 100);
  }

  // ============================================================
  // STEP 4 — PHONE VERIFICATION
  // ============================================================

  getCountries(): void {
    this.countryService.findAll().subscribe({
      next: (res) => {
        this.countries = res;
        // Si el contrato ya cargó y tiene teléfono, actualizar selectedCountryCode
        if (this.phonePrefix) {
          const country = this.countries.find(c => c.phonePrefix === this.phonePrefix);
          if (country) {
            this.selectedCountryCode = country.code!;
          } else {
            // Fallback a Italia si no se encuentra el país
            const italy = this.countries.find(c => c.code === 'IT');
            if (italy && !this.contract?.user?.phoneNumber) {
              this.selectedCountryCode = 'IT';
              this.phonePrefix         = italy.phonePrefix || '+39';
            }
          }
        }
      }
    });
  }

  onCountryChange(event: any): void {
    const country = this.countries.find(c => c.phonePrefix === event.detail.value);
    if (country) {
      this.selectedCountryCode = country.code!;
      this.phonePrefix         = event.detail.value;
    }
  }

  onPhoneNumberInput(event: any): void { this.phoneNumber = event.target.value; }
  isPhoneValid(): boolean { return /^[0-9]{6,15}$/.test(this.phoneNumber); }

  requestVerificationCode(): void {
    if (!this.isPhoneValid() || this.smsCodeId) return;
    this.sendSms();
  }

  sendSms(): void {
    const req: SmsSendCodeRequest = {
      from:         environment.appName,
      to:           `${this.phonePrefix}${this.phoneNumber}`,
      text:         this.translate.instant('GENERAL.VERIFICATION_CODE'),
      languageCode: localStorage.getItem('language') ?? 'it',
    };
    this.smsCodeService.sendSms(req).subscribe({
      next: (response) => {
        this.cleanTime();
        this.smsCodeId = response.entity.id;
        this.timeCheckCode();
        setTimeout(() => {
          if (!this.smsCodeRead) this.codeInputs.toArray()[0]?.nativeElement.focus();
        }, this.platformService.isAndroid() ? 8000 : 5000);
      },
      error: () => { this.smsCodeId = ''; }
    });
  }

  resendCode(): void {
    if (this.timer > 0) return;
    (['code1','code2','code3','code4','code5','code6'] as const)
      .forEach(k => this.formCode.controls[k].setValue(null));
    this.codeInputs.toArray().forEach(i => i.nativeElement.value = '');
    this.pinCount  = 0;
    this.smsCodeId = '';
    this.sendSms();
  }

  inputCode(n: number): void {
    const keys = ['code1','code2','code3','code4','code5','code6'] as const;
    if (n < 6 && this.formCode.controls[keys[n - 1]].value) {
      this.codeInputs.toArray()[n]?.nativeElement.focus();
    }
    this.checkPinCount();
  }

  checkPinCount(): void {
    this.pinCount = (['code1','code2','code3','code4','code5','code6'] as const)
      .filter(k => !!this.formCode.controls[k].value).length;
  }

  cleanInput(key: 'code1'|'code2'|'code3'|'code4'|'code5'|'code6'): void {
    this.formCode.controls[key].setValue(null);
  }

  onOtpInput(event: any): void {
    const value = event.data;
    if (value?.length === 6) this.setCode(value);
  }

  setCode(code: string): void {
    (['code1','code2','code3','code4','code5','code6'] as const)
      .forEach((k, i) => this.formCode.controls[k].setValue(code[i]));
    setTimeout(() => this.checkPinCount(), 0);
  }

  onCodeKeydown(event: KeyboardEvent, index: number): void {
    const input = event.target as HTMLInputElement;
    if (event.key === 'Backspace' && !input.value && index > 0) {
      this.codeInputs.toArray()[index - 1].nativeElement.focus();
    }
  }

  onCodePaste(event: ClipboardEvent): void {
    event.preventDefault();
    const digits = (event.clipboardData?.getData('text') || '').replace(/\D/g, '').slice(0, 6);
    const inputs = this.codeInputs.toArray();
    digits.split('').forEach((d, i) => {
      const key = `code${i + 1}` as 'code1'|'code2'|'code3'|'code4'|'code5'|'code6';
      this.formCode.controls[key].setValue(d);
      if (inputs[i]) inputs[i].nativeElement.value = d;
    });
    inputs[Math.min(digits.length, 5)]?.nativeElement.focus();
  }

  isCodeComplete(): boolean { return this.pinCount === 6; }

  // FIX 3: timeCheckCode() corregido.
  // Bug original: cuando timer llegaba a 0 se llamaba cleanTime() que reseteaba
  // timer = 60, dejando el botón de reenvío siempre deshabilitado (timer > 0 siempre true).
  // Fix: al llegar a 0 solo se limpia el intervalo y timer queda en 0,
  // permitiendo que resendCode() se pueda ejecutar.
  timeCheckCode(): void {
    this.timer   = this.duration;
    this.percent = 0;
    this.timeCheck = setInterval(() => {
      this.timer--;
      this.minutes = Math.floor(this.timer / 60);
      this.seconds = this.timer % 60;
      this.percent = 100 - (this.timer * 100) / this.duration;
      if (this.timer <= 0) {
        clearInterval(this.timeCheck);
        this.timeCheck = null;
        this.percent   = 100;
        this.timer     = 0; // se queda en 0 → el botón de reenvío se habilita
      }
    }, 1000);
  }

  cleanTime(): void {
    clearInterval(this.timeCheck);
    this.timeCheck = null;
    this.percent   = 0;
    this.minutes   = 1;
    this.seconds   = 0;
    this.duration  = 60;
    this.timer     = 60;
  }

  stopTimer(): void { this.cleanTime(); }

  // ============================================================
  // SUBMIT
  // ============================================================

  async verifyAndSign(): Promise<void> {
    if (!this.isCodeComplete()) return;
    if (!this.frontDocumentPhoto || !this.backDocumentPhoto || !this.selfiePhoto) return;
    if (!this.contract) return;

    this.isSubmitting = true;

    const code = (['code1','code2','code3','code4','code5','code6'] as const)
      .map(k => this.formCode.controls[k].value).join('');

    this.smsCodeService.checkCode(code, this.smsCodeId).subscribe({
      next: async (valid) => {
        if (!valid) { this.isSubmitting = false; return; }
        try {
          const basePath = `contracts/${this.contractId}`;
          const [frontUrl, backUrl, selfieUrl] = await Promise.all([
            this.uploadService.uploadFile(this.base64ToBlob(this.frontDocumentPhoto!), `${basePath}/${uuidv4()}.jpg`),
            this.uploadService.uploadFile(this.base64ToBlob(this.backDocumentPhoto!),  `${basePath}/${uuidv4()}.jpg`),
            this.uploadService.uploadFile(this.base64ToBlob(this.selfiePhoto!),        `${basePath}/${uuidv4()}.jpg`),
          ]);

          if (!frontUrl || !backUrl || !selfieUrl) throw new Error('Upload failed');

          const payload: ContractSignPayload = {
            type:             this.contract!.type ?? '',
            status:           'signed',
            documentUrl:      this.contract!.documentUrl,
            expirationDate:   this.contract!.expirationDate ?? null,
            frontDocumentUrl: frontUrl,
            backDocumentUrl:  backUrl,
            selfieUrl,
            user: { id: this.contract!.user.id },
          };

          this.contractService.sign(this.contractId, payload).subscribe({
            next:  () => { this.isSubmitting = false; this.cleanTime(); this.step = 5; },
            error: () => { this.isSubmitting = false; }
          });

        } catch {
          this.isSubmitting = false;
        }
      },
      error: () => { this.isSubmitting = false; }
    });
  }

  // ============================================================
  // HELPERS
  // ============================================================

  private readFileAsBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload  = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  private base64ToBlob(base64: string): Blob {
    const [header, data] = base64.split(',');
    const mime           = header.match(/:(.*?);/)![1];
    const binary         = atob(data);
    const array          = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) array[i] = binary.charCodeAt(i);
    return new Blob([array], { type: mime });
  }
}
