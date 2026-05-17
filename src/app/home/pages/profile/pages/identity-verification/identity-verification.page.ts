import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  OnDestroy,
  OnInit,
  ViewChild,
  ElementRef
} from '@angular/core';
import { IonContent, IonIcon }                                                                        from '@ionic/angular/standalone';
import { NgxSpinnerService }                                                                          from 'ngx-spinner';
import { CommonModule }                                                                               from '@angular/common';
import { ToastrService }                                                                              from 'ngx-toastr';
import { v4 as uuidv4 }                                                                               from 'uuid';

import { HeaderComponent }                                                                            from 'src/app/components/header/header.component';
import { UploadService }                                                                              from 'src/app/shared/services';
import { IdentityVerificationService, PermissionsResponse }                                           from 'src/app/shared/services/identity-verification.service';
import { ComponentModule }                                                                            from 'src/app/components/component.module';

// ============================================
// INTERFACES
// ============================================

export interface IdentityVerificationData {
  id: string | null;
  frontDocumentUrl: string | null;
  backDocumentUrl: string | null;
  selfieUrl: string | null;
  verifiedAt: Date | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  /**
   * - 'not_started' → mai inviato documenti
   * - 'pending'     → documenti inviati, in attesa di revisione admin
   * - 'verified'    → approvato dall'admin
   * - 'failed'      → rifiutato dall'admin (può riprovare)
   */
  status: 'not_started' | 'pending' | 'verified' | 'failed';
  verificationId?: string;
  submittedAt?: Date | null;
}

export interface SubmitVerificationPayload {
  userId: string;
  documentType: 'national_id';
  status: 'pending';
  frontDocumentUrl: string;
  backDocumentUrl: string;
  selfieUrl: string;
}

export interface IdentityVerificationResponse {
  id: string;
  userId: string;
  documentType: string;
  status: 'not_started' | 'pending' | 'verified' | 'failed';
  frontDocumentUrl: string;
  backDocumentUrl: string;
  selfieUrl: string;
  createdAt: string;
  updatedAt: string;
}

export const DOCUMENT_TYPE = 'national_id' as const;


// ============================================
// COMPONENT
// ============================================

@Component({
  selector: 'app-identity-verification',
  templateUrl: './identity-verification.page.html',
  styleUrls: ['./identity-verification.page.scss'],
  standalone: true,
  imports: [IonContent, ComponentModule, IonIcon, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class IdentityVerificationPage implements OnInit, OnDestroy {

  // ============================================
  // VIEW CHILDREN
  // ============================================

  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement') canvasElement!: ElementRef<HTMLCanvasElement>;

  // ============================================
  // VIEW STATE FLAGS
  // ============================================

  isAlreadyVerified: boolean = false;
  isPendingReview:   boolean = false;
  isSubmitError:     boolean = false;
  isSubmitting:      boolean = false;
  isLoadingStatus:   boolean = false;

  verificationData: IdentityVerificationData | null = null;

  // ============================================
  // CAPTURE STATE
  // ============================================

  step: number = 0;

  // base64 locale — solo per anteprima a schermo
  frontDocumentPhoto: string | null = null;
  backDocumentPhoto:  string | null = null;
  selfiePhoto:        string | null = null;

  isCameraActive:        boolean = false;
  isFaceDetected:        boolean = false;
  mediaStream:           MediaStream | null = null;
  faceDetectionInterval: any = null;

  private userId: string = '';

  constructor(
    private spinner:         NgxSpinnerService,
    private toastr:          ToastrService,
    private uploadService:   UploadService,
    private identityService: IdentityVerificationService
  ) {}

  ngOnInit() {
    try {
      const raw  = localStorage.getItem('appPassaparola_user');
      const user = raw ? JSON.parse(raw) : null;
      this.userId = user?.userID ?? '';
    } catch {
      this.userId = '';
    }
    this.loadVerificationStatus();
  }

  ngOnDestroy() {
    this.stopCamera();
  }

  // ============================================
  // INITIALIZATION
  // ============================================

  /**
   * Punto di ingresso all'apertura della schermata.
   *
   * GET /api/user/{userId}/permissions
   *   identityVerified: true  → vista verificata (sola lettura)
   *   identityVerified: false → mostra flusso di acquisizione
   *
   * Se il backend in futuro restituisce lo stato del record
   * (pending / failed) all'interno dei permessi, mappare qui.
   */
  private loadVerificationStatus() {
    if (!this.userId) {
      this.step = 0;
      return;
    }

    this.isLoadingStatus = true;

    this.identityService.getPermissions(this.userId).subscribe({
      next: (permissions: PermissionsResponse) => {
        this.isLoadingStatus = false;

        if (permissions.identityVerified && permissions.approvedVerification) {
          // Verificato — vista sola lettura con documenti approvati
          const v = permissions.approvedVerification;
          this.verificationData = {
            id:               v.id,
            status:           'verified',
            frontDocumentUrl: v.frontDocumentUrl || null,
            backDocumentUrl:  v.backDocumentUrl  || null,
            selfieUrl:        v.selfieUrl        || null,
            verifiedAt:       v.updatedAt ? new Date(v.updatedAt) : null,
            createdAt:        v.createdAt ? new Date(v.createdAt) : null,
            updatedAt:        v.updatedAt ? new Date(v.updatedAt) : null,
            submittedAt:      v.createdAt ? new Date(v.createdAt) : null,
            verificationId:   v.id
          };
          this.isAlreadyVerified = true;

        } else if (!permissions.identityVerified && permissions.pendingVerification) {
          // Documenti inviati, in attesa di revisione admin
          const p = permissions.pendingVerification;
          this.verificationData = {
            id:               p.id,
            status:           'pending',
            frontDocumentUrl: p.frontDocumentUrl || null,
            backDocumentUrl:  p.backDocumentUrl  || null,
            selfieUrl:        p.selfieUrl        || null,
            verifiedAt:       null,
            createdAt:        p.createdAt ? new Date(p.createdAt) : null,
            updatedAt:        p.updatedAt ? new Date(p.updatedAt) : null,
            submittedAt:      p.createdAt ? new Date(p.createdAt) : null,
            verificationId:   p.id
          };
          this.isPendingReview = true;

        } else {
          // Nessuna verifica precedente — flusso di acquisizione dal passo 0
          this.step = 0;
        }
      },
      error: () => {
        this.isLoadingStatus = false;
        this.step = 0;
      }
    });
  }

  // ============================================
  // STEP NAVIGATION
  // ============================================

  goToNextStep() {
    this.stopCamera();
    this.step++;
    if (this.step === 1 || this.step === 2) {
      setTimeout(() => this.startCamera(), 300);
    }
  }

  goToPreviousStep() {
    this.stopCamera();
    this.step--;
    setTimeout(() => this.startCamera(), 300);
  }

  // ============================================
  // CAMERA — getUserMedia per i 3 passi
  // passi 0 e 1: fotocamera posteriore (environment)
  // passo 2:     fotocamera frontale (user) + rilevamento viso
  // ============================================

  isCameraLoading: boolean = false;

  async startCamera() {
    try {
      this.isCameraLoading = true;
      const facingMode = this.step === 2 ? 'user' : 'environment';

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
          if (this.step === 2) this.startFaceDetection();
        };
      } else {
        this.isCameraLoading = false;
      }
    } catch (error) {
      this.isCameraLoading = false;
      console.error('Errore fotocamera:', error);
      this.toastr.error('Impossibile accedere alla fotocamera. Verifica i permessi.');
    }
  }

  stopCamera() {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(t => t.stop());
      this.mediaStream = null;
    }
    if (this.faceDetectionInterval) {
      clearInterval(this.faceDetectionInterval);
      this.faceDetectionInterval = null;
    }
    this.isCameraActive = false;
    this.isFaceDetected = false;
  }

  // ============================================
  // DOCUMENT CAPTURE (passi 0 e 1)
  // ============================================

  captureDocument(side: 'front' | 'back') {
    if (!this.videoElement) return;
    const video  = this.videoElement.nativeElement;
    const canvas = document.createElement('canvas');
    canvas.width  = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const photo = canvas.toDataURL('image/jpeg', 0.92);
      side === 'front'
        ? (this.frontDocumentPhoto = photo)
        : (this.backDocumentPhoto  = photo);
      this.stopCamera();
    }
  }

  retakeDocument(side: 'front' | 'back') {
    side === 'front'
      ? (this.frontDocumentPhoto = null)
      : (this.backDocumentPhoto  = null);
    setTimeout(() => this.startCamera(), 100);
  }

  onFrontDocumentUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) {
      this.readFileAsBase64(input.files[0]).then(b64 => {
        this.frontDocumentPhoto = b64;
      });
    }
  }

  onBackDocumentUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) {
      this.readFileAsBase64(input.files[0]).then(b64 => {
        this.backDocumentPhoto = b64;
      });
    }
  }

  private readFileAsBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload  = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // ============================================
  // FACE DETECTION (passo 2)
  // ============================================

  startFaceDetection() {
    this.faceDetectionInterval = setInterval(() => this.detectFace(), 500);
  }

  detectFace() {
    if (!this.videoElement || !this.canvasElement) return;
    const video  = this.videoElement.nativeElement;
    const canvas = this.canvasElement.nativeElement;
    const ctx    = canvas.getContext('2d');
    if (!ctx || video.readyState !== video.HAVE_ENOUGH_DATA) return;

    canvas.width  = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    /**
     * TODO: sostituire con rilevamento reale.
     *
     * Opzione A — face-api.js:
     *   const d = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions());
     *   this.isFaceDetected = !!d;
     *
     * Opzione B — MediaPipe FaceMesh:
     *   faceMesh.onResults(r => { this.isFaceDetected = r.multiFaceLandmarks.length > 0; });
     *
     * Opzione C — Endpoint liveness backend:
     *   this.identityService.detectFace(canvas.toDataURL())
     *     .subscribe(r => { this.isFaceDetected = r.faceDetected; });
     */

    // SIMULAZIONE — eliminare in produzione:
    if (!this.isFaceDetected && this.isCameraActive) {
      setTimeout(() => { this.isFaceDetected = true; }, 2000);
    }
  }

  captureSelfie() {
    if (!this.isFaceDetected || !this.videoElement) return;
    const video  = this.videoElement.nativeElement;
    const canvas = document.createElement('canvas');
    canvas.width  = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      this.selfiePhoto = canvas.toDataURL('image/jpeg', 0.92);
      this.stopCamera();
    }
  }

  retakeSelfie() {
    this.selfiePhoto    = null;
    this.isFaceDetected = false;
    setTimeout(() => this.startCamera(), 100);
  }

  // ============================================
  // SUBMIT FOR REVIEW
  // ============================================

  /**
   * Flusso completo:
   *
   * 1. Converte i 3 base64 in Blob
   * 2. Carica le 3 immagini in parallelo su Krathemis con UploadService
   * 3. POST /api/user/identity-verification con i 3 URL risultanti
   * 4. Salva l'id del record in localStorage
   * 5. Mostra la vista "In revisione"
   */
  async submitVerification() {
    if (!this.frontDocumentPhoto || !this.backDocumentPhoto || !this.selfiePhoto) return;

    this.isSubmitting  = true;
    this.isSubmitError = false;

    try {
      const frontBlob  = this.base64ToBlob(this.frontDocumentPhoto);
      const backBlob   = this.base64ToBlob(this.backDocumentPhoto);
      const selfieBlob = this.base64ToBlob(this.selfiePhoto);

      const basePath = `identity-verification/${this.userId}`;

      const [frontUrl, backUrl, selfieUrl] = await Promise.all([
        this.uploadService.uploadFile(frontBlob,  `${basePath}/${uuidv4()}.jpg`),
        this.uploadService.uploadFile(backBlob,   `${basePath}/${uuidv4()}.jpg`),
        this.uploadService.uploadFile(selfieBlob, `${basePath}/${uuidv4()}.jpg`)
      ]);

      if (!frontUrl || !backUrl || !selfieUrl) {
        throw new Error('Caricamento su Krathemis fallito');
      }

      const payload: SubmitVerificationPayload = {
        userId:           this.userId,
        documentType:     DOCUMENT_TYPE,
        status:           'pending',
        frontDocumentUrl: frontUrl,
        backDocumentUrl:  backUrl,
        selfieUrl:        selfieUrl
      };

      this.identityService.submit(payload).subscribe({
        next:  (res) => this.onSubmitSuccess(res),
        error: (err) => this.onSubmitError(err)
      });

    } catch (err) {
      this.onSubmitError(err);
    }
  }

  private onSubmitSuccess(res: IdentityVerificationResponse) {
    this.isSubmitting = false;

    this.verificationData = {
      id:               res.id,
      frontDocumentUrl: res.frontDocumentUrl,
      backDocumentUrl:  res.backDocumentUrl,
      selfieUrl:        res.selfieUrl,
      verifiedAt:       null,
      submittedAt:      new Date(res.createdAt),
      status:           'pending',
      verificationId:   res.id
    };

    this.isPendingReview = true;
  }

  private onSubmitError(error: any) {
    this.isSubmitting  = false;
    this.isSubmitError = true;
    console.error('Errore invio verifica:', error);
    this.toastr.error('Errore durante l\'invio dei documenti. Riprova.');
  }

  /** Riprova dopo errore — torna al selfie con le foto intatte */
  retrySubmit() {
    this.isSubmitError  = false;
    this.isSubmitting   = false;
    this.isCameraLoading = false;
    this.step = 2;
    setTimeout(() => this.startCamera(), 300);
  }

  // ============================================
  // HELPERS
  // ============================================

  private base64ToBlob(base64: string): Blob {
    const [header, data] = base64.split(',');
    const mime           = header.match(/:(.*?);/)![1];
    const binary         = atob(data);
    const array          = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      array[i] = binary.charCodeAt(i);
    }
    return new Blob([array], { type: mime });
  }

  // ============================================
  // SOLO SVILUPPO — eliminare prima della produzione
  // ============================================

  /**
   * Chiamare in ngOnInit() per visualizzare stati senza backend:
   *   this.mockState('verified');
   */
  private mockState(status: IdentityVerificationData['status']) {
    const mocks: Record<string, IdentityVerificationData> = {
      not_started: {
        id: null, status: 'not_started',
        frontDocumentUrl: null, backDocumentUrl: null, selfieUrl: null,
        verifiedAt: null, submittedAt: null
      },
      pending: {
        id: 'VER-MOCK-001', status: 'pending',
        frontDocumentUrl: null, backDocumentUrl: null, selfieUrl: null,
        verifiedAt: null, submittedAt: new Date(), verificationId: 'VER-MOCK-001'
      },
      verified: {
        id: 'VER-MOCK-002', status: 'verified',
        frontDocumentUrl: 'https://placehold.co/400x250',
        backDocumentUrl:  'https://placehold.co/400x250',
        selfieUrl:        'https://placehold.co/200x200',
        verifiedAt:       new Date('2026-01-15T10:30:00Z'),
        submittedAt:      new Date('2026-01-14T09:00:00Z'),
        verificationId:   'VER-MOCK-002'
      },
      failed: {
        id: 'VER-MOCK-003', status: 'failed',
        frontDocumentUrl: null, backDocumentUrl: null, selfieUrl: null,
        verifiedAt: null, submittedAt: new Date('2026-01-14T09:00:00Z'),
        verificationId:   'VER-MOCK-003'
      }
    };

    this.verificationData = mocks[status];
    if (status === 'verified') { this.isAlreadyVerified = true; return; }
    if (status === 'pending')  { this.isPendingReview   = true; return; }
    this.step = 0;
  }
}
