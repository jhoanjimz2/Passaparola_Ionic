import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ModalController } from '@ionic/angular';

import { CameraService } from 'src/app/shared/services/camera.service';

@Component({
  selector: 'app-bs-suggest-camera',
  templateUrl: './bs-suggest-camera.component.html',
  styleUrls: ['./bs-suggest-camera.component.scss'],
})
export class BsSuggestCameraComponent implements OnInit {
  form: FormGroup = {} as FormGroup;
  pictureUrl = '';
  pictureFile: Blob | undefined;

  constructor(
    private cameraService: CameraService,
    private formBuild: FormBuilder,
    private modalController: ModalController
  ) {}

  async ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.form = this.formBuild.group({
      dontShowMore: new FormControl(false, []),
    });
  }

  onCloseModal() {
    this.modalController.dismiss();
  }

  async onOpenCamera() {
    localStorage.setItem(
      'appPassaparola_dontShowMoreBusinessSuggestion',
      this.form.controls['dontShowMore'].value
    );

    this.cameraService
      .getPhoto()
      .then(({ imageUrl, file }) => {
        this.modalController.dismiss({
          pictureUrl: imageUrl!,
          pictureFile: file,
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }
}
