import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CameraSource } from '@capacitor/camera';

import { CameraService } from 'src/app/shared/services/camera.service';
import {
  BugReportService,
  UploadService,
  WalletService,
} from 'src/app/shared/services';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Wallet } from 'src/app/shared/interfaces/wallet/wallet.interface';
import { BugReport } from 'src/app/shared/interfaces/bug-report/bug-report.interface';
import { ModalController, NavController } from '@ionic/angular';
import { CreateSuccesfullyComponent } from '../../components/create-succesfully/create-succesfully.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  bugReport: BugReport | undefined;
  formBug: FormGroup = {} as FormGroup;
  mainImageFile: Blob | undefined;
  imageFile1: Blob | undefined;
  imageFile2: Blob | undefined;
  imageFile3: Blob | undefined;
  imageFile4: Blob | undefined;

  saving = false;
  walletTo: Wallet | undefined;
  userId = '';

  constructor(
    private formBuild: FormBuilder,
    private cameraService: CameraService,
    private uploadService: UploadService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private spinner: NgxSpinnerService,
    private walletService: WalletService,
    private bugReportService: BugReportService,
    private modalController: ModalController,
    private navController: NavController
  ) {}

  ngOnInit() {
    this.builFormBug();

    const user = localStorage.getItem('appPassaparola_user');
    this.userId = JSON.parse(user!).userID;

    this.walletService.findDefaultWallet(this.userId).subscribe({
      next: (response) => (this.walletTo = response),
    });

    // this.succesfullyComponent();
  }

  builFormBug() {
    this.formBug = this.formBuild.group({
      mainImage: new FormControl('', [Validators.required]),
      image1: new FormControl('', []),
      image2: new FormControl('', []),
      image3: new FormControl('', []),
      image4: new FormControl('', []),
      description: new FormControl('', [Validators.required]),
    });
  }

  async save() {
    if (this.formBug.invalid) return;

    this.saving = true;
    this.spinner.show();

    const files: Blob[] = [this.mainImageFile!];

    if (this.imageFile1) files.push(this.imageFile1);
    if (this.imageFile2) files.push(this.imageFile2);
    if (this.imageFile3) files.push(this.imageFile3);
    if (this.imageFile4) files.push(this.imageFile4);

    const images = (await this.uploadService.uploadFiles(
      files,
      'passaparola/bug-report'
    )) as string[];

    if (!images) {
      this.toastr.error(
        this.translate.instant('Error al intentar guardar las imaganes')
      );
      return;
    }

    if (!this.walletTo?.id) {
      this.toastr.error(
        this.translate.instant('Error al intentar guardar la información')
      );
      return;
    }

    this.bugReport = {
      description: this.formBug.controls['description'].value,
      images,
      userId: this.userId,
      walletTo: this.walletTo?.id!,
      walletFrom: 'c0332de7-a3db-484d-9261-193e1cba7782',
    };

    this.bugReportService.create(this.bugReport).subscribe({
      next: (response) => {
        this.bugReport = response;
        this.succesfullyComponent();
        this.builFormBug();
      },
      complete: () => (this.saving = false),
    });
  }

  async succesfullyComponent() {
    const modal = await this.modalController.create({
      component: CreateSuccesfullyComponent,
      cssClass: 'modal-full-screen',
      backdropDismiss: true,
      componentProps: {},
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();
    this.navController.navigateForward(['']);
  }

  async takePicture(image: 'main' | 1 | 2 | 3 | 4) {
    try {
    } catch (error) {}
    this.cameraService
      .getPhoto(CameraSource.Prompt)
      // .getPhoto()
      .then(({ imageUrl, file }) => {
        if (image === 'main') {
          this.formBug.controls['mainImage'].setValue(imageUrl);
          this.mainImageFile = file;
        }

        if (image === 1) {
          this.formBug.controls['image1'].setValue(imageUrl);
          this.imageFile1 = file;
        }

        if (image === 2) {
          this.formBug.controls['image2'].setValue(imageUrl);
          this.imageFile2 = file;
        }

        if (image === 3) {
          this.formBug.controls['image3'].setValue(imageUrl);
          this.imageFile3 = file;
        }

        if (image === 4) {
          this.formBug.controls['image4'].setValue(imageUrl);
          this.imageFile4 = file;
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }
}
