import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BsSuggestCameraComponent } from 'src/app/home/map/components/bs-create/bs-suggest-camera/bs-suggest-camera.component';
import { BsSuggestInformationStep1Component } from 'src/app/home/map/components/bs-create/bs-suggest-information-step1/bs-suggest-information-step1.component';
import { BsSuggestInformationStep2Component } from 'src/app/home/map/components/bs-create/bs-suggest-information-step2/bs-suggest-information-step2.component';
import { BsSuggestInformationStep3Component } from 'src/app/home/map/components/bs-create/bs-suggest-information-step3/bs-suggest-information-step3.component';
import { BsSuggestInformationStep4Component } from 'src/app/home/map/components/bs-create/bs-suggest-information-step4/bs-suggest-information-step4.component';
import { BsTabsComponent } from 'src/app/home/map/components/bs-tabs/bs-tabs.component';
import { IBSDataFlow } from 'src/app/shared/interfaces/business-suggestion/business-suggestion.interface';
import { CameraService } from 'src/app/shared/services/camera.service';

@Component({
  selector: 'app-modal-info-restaurant',
  templateUrl: './modal-info-restaurant.component.html',
  styleUrls: ['./modal-info-restaurant.component.scss'],
})
export class ModalInfoRestaurantComponent implements OnInit {
  @Input() category = '';
  dataFlow: IBSDataFlow = {
    address: '',
    category: '',
    country: '',
    countryCode: '',
    description: '',
    email: '',
    name: '',
    owner: '',
    phoneNumber: '',
    pictureFile: undefined,
    pictureUrl: '',
    place: {},
  };
  dontShowMore = true;

  constructor(
    private cameraService: CameraService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    const dontShowMore =
      localStorage.getItem('appPassaparola_dontShowMoreBusinessSuggestion') ||
      'false';

    this.dontShowMore = dontShowMore === 'true' ? false : true;
  }

  async onOpenModalBsSuggestCamera() {
    this.dataFlow = {
      address: '',
      category: '',
      country: '',
      countryCode: '',
      description: '',
      email: '',
      name: '',
      owner: '',
      phoneNumber: '',
      pictureFile: undefined,
      pictureUrl: '',
      place: {},
    };

    if (this.dontShowMore) {
      const modal = await this.modalController.create({
        component: BsSuggestCameraComponent,
        cssClass: 'modal-75vh',
        backdropDismiss: true,
        componentProps: {},
      });
      await modal.present();

      const { data } = await modal.onWillDismiss();

      if (data?.pictureFile && data?.pictureUrl) {
        this.dataFlow.pictureUrl = data.pictureUrl;
        this.dataFlow.pictureFile = data.pictureFile;

        this.onOpenModalBsSuggestInformationStep1();
      }
    } else {
      await this.onOpenCamera();
    }
  }

  async onOpenCamera() {
    this.cameraService
      .getPhoto()
      .then(({ imageUrl, file }) => {
        this.dataFlow.pictureUrl = imageUrl!;
        this.dataFlow.pictureFile = file;

        this.onOpenModalBsSuggestInformationStep1();
      })
      .catch((err) => {
        console.error(err);
      });
  }

  async onOpenModalBsSuggestInformationStep1() {
    const modal = await this.modalController.create({
      component: BsSuggestInformationStep1Component,
      cssClass: 'modal-full-screen',
      backdropDismiss: true,
      componentProps: { dataFlow: this.dataFlow },
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();

    if (data?.previousStep) {
      this.dataFlow = data.dataFlow;
      this.onOpenModalBsSuggestCamera();
    } else if (data?.nextStep) {
      this.dataFlow = data.dataFlow;
      this.onOpenModalBsSuggestInformationStep2();
    }
  }

  async onOpenModalBsSuggestInformationStep2() {
    const modal = await this.modalController.create({
      component: BsSuggestInformationStep2Component,
      cssClass: 'modal-full-screen',
      backdropDismiss: true,
      componentProps: { dataFlow: this.dataFlow },
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();

    if (data?.previousStep) {
      this.dataFlow = data.dataFlow;
      this.onOpenModalBsSuggestInformationStep1();
    } else if (data?.nextStep) {
      this.dataFlow = data.dataFlow;
      this.onOpenModalBsSuggestInformationStep3();
    }
  }

  async onOpenModalBsSuggestInformationStep3() {
    const modal = await this.modalController.create({
      component: BsSuggestInformationStep3Component,
      cssClass: 'modal-full-screen',
      backdropDismiss: true,
      componentProps: { dataFlow: this.dataFlow },
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();

    if (data?.previousStep) {
      this.dataFlow = data.dataFlow;
      this.onOpenModalBsSuggestInformationStep2();
    } else if (data?.nextStep) {
      this.dataFlow = data.dataFlow;
      this.onOpenModalBsSuggestInformationStep4();
    }
  }

  async onOpenModalBsSuggestInformationStep4() {
    const modal = await this.modalController.create({
      component: BsSuggestInformationStep4Component,
      cssClass: 'modal-full-screen',
      backdropDismiss: true,
      componentProps: { dataFlow: this.dataFlow },
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();

    if (data?.goToYourSuggestions) {
      this.onOpenModalBsTabs();
    }
  }

  async onOpenModalBsTabs() {
    const modal = await this.modalController.create({
      component: BsTabsComponent,
      cssClass: 'modal-full-screen',
      backdropDismiss: true,
      componentProps: { dataFlow: this.dataFlow },
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();

    if (data?.goToNewBS) {
      this.onOpenModalBsSuggestCamera();
    }
  }

  close() {
    this.modalController.dismiss();
  }
}
