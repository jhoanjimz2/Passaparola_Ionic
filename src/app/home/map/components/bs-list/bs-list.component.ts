import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';

import {
  EStatus,
  IBSDataFlow,
  IBusinessSuggestion,
  TStatus,
} from 'src/app/shared/interfaces/business-suggestion/business-suggestion.interface';
import { CameraService } from 'src/app/shared/services/camera.service';
import { BsSuggestInformationStep1Component } from '../bs-create/bs-suggest-information-step1/bs-suggest-information-step1.component';
import { BsSuggestInformationStep3Component } from '../bs-create/bs-suggest-information-step3/bs-suggest-information-step3.component';
import { BsSuggestInformationStep4Component } from '../bs-create/bs-suggest-information-step4/bs-suggest-information-step4.component';
import { BsTabsComponent } from '../bs-tabs/bs-tabs.component';
import { BsSuggestInformationStep2Component } from '../bs-create/bs-suggest-information-step2/bs-suggest-information-step2.component';

@Component({
  selector: 'app-bs-list',
  templateUrl: './bs-list.component.html',
  styleUrls: ['./bs-list.component.scss'],
})
export class BsListComponent implements OnInit {
  @Input('businessSuggestions') businessSuggestions: IBusinessSuggestion[] = [];
  @Output() findAll = new EventEmitter<any>();

  eStatus = EStatus;
  status: TStatus = EStatus.all;

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

  constructor(
    private modalController: ModalController,
    private cameraService: CameraService
  ) {}

  ngOnInit() {}

  onFindAll() {
    this.findAll.emit({ status: this.status });
  }

  async onGoToNewBS() {
    // this.modalController.dismiss({
    //   goToNewBS: true,
    // });

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
    await this.onOpenCamera();
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

    this.dataFlow = data.dataFlow;
    this.onOpenModalBsSuggestInformationStep2();
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

    if (data?.goHome) {
      let modal = await this.modalController.getTop();
      while (modal) {
        await this.modalController.dismiss();
        modal = await this.modalController.getTop();
      }
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
  }
}
