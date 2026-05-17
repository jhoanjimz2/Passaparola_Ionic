import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';
import { switchMap } from 'rxjs';

import { AuthenticationService } from 'src/app/core/service/authentication.service';
import { CompanyType } from 'src/app/shared/interfaces/company/company-type.interface';
import { Company } from 'src/app/shared/interfaces/company/company.interface';
import { ProfileCompany } from 'src/app/shared/interfaces/company/profile-company.interface';
import { CompanyService } from 'src/app/shared/services';
import { AddressOnTheMapComponent } from './components/address-on-the-map/address-on-the-map.component';
import { ModalController } from '@ionic/angular';
import { PlaceSearchResult } from 'src/app/shared/interfaces/google-maps/place-search-result.interface';
import { CompanyLegalType } from 'src/app/shared/interfaces/company/company-legal-type.interface';
import { ToastrService } from 'ngx-toastr';

interface DataFlow {
  place: PlaceSearchResult | any;
}

@Component({
  selector: 'app-tax-data',
  templateUrl: './tax-data.page.html',
  styleUrls: ['./tax-data.page.scss'],
})
export class TaxDataPage implements OnInit {
  formTaxdata: FormGroup = {} as FormGroup;
  company: Company = {} as Company;
  disabledForm = true;
  companyLegalTypes: CompanyLegalType[] = [];
  dataFlow: DataFlow = {} as DataFlow;

  constructor(
    private formBuild: FormBuilder,
    private authenticationService: AuthenticationService,
    private translate: TranslateService,
    private companyService: CompanyService,
    private modalController: ModalController,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.getCompanyLegalTypes();
    this.getCompany();
    this.buildFormTaxData();
  }

  buildFormTaxData() {
    this.formTaxdata = this.formBuild.group({
      name: new FormControl(
        { value: this.company.profile?.name, disabled: this.disabledForm },
        [Validators.required]
      ),
      iva: new FormControl(
        { value: this.company.profile?.iva, disabled: this.disabledForm },
        [Validators.required]
      ),
      type: new FormControl(
        { value: this.company.legalType?.id, disabled: this.disabledForm },
        [Validators.required]
      ),
      legalRepresentative: new FormControl(
        {
          value: this.company.profile?.legalRepresentative,
          disabled: this.disabledForm,
        },
        [Validators.required]
      ),
      legalRepresentativeFiscal: new FormControl(
        {
          value: this.company.profile?.legalRepresentativeFiscal,
          disabled: this.disabledForm,
        },
        [Validators.required]
      ),
      address: new FormControl(
        {
          value: this.company.profile?.legalAddress,
          disabled: this.disabledForm,
        },
        [Validators.required]
      ),
      legalLatitude: new FormControl(this.company.profile?.legalLatitude, [
        Validators.required,
      ]),
      legalLongitude: new FormControl(this.company.profile?.legalLongitude, [
        Validators.required,
      ]),
    });
  }

  getCompanyLegalTypes() {
    this.companyService.getCompanyLegalTypes().subscribe({
      next: (response) => (this.companyLegalTypes = response),
    });
  }

  getCompany() {
    this.companyService
      .getCompanyById(this.authenticationService.user.id)
      .subscribe({
        next: (response) => {
          this.company = response;
          this.authenticationService.user = response;
          localStorage.setItem(
            'appPassaparola_user',
            JSON.stringify(this.company)
          );
          this.buildFormTaxData();
        },
      });
  }

  editProfile() {
    this.disabledForm = !this.disabledForm;
    this.buildFormTaxData();
  }

  updateInfo() {
    const company = {
      id: this.company.id,
      // country: this.company.country,
      legalType: this.companyLegalTypes.find(
        (item) => item.id === this.formTaxdata.controls['type'].value
      ),
    };
    this.companyService
      .updateCompany(company)
      .pipe(
        switchMap((company) => {
          const profile: ProfileCompany = {
            id: this.company.profile?.id,
            name: this.formTaxdata.controls['name'].value,
            iva: this.formTaxdata.controls['iva'].value,
            legalRepresentative:
              this.formTaxdata.controls['legalRepresentative'].value,
            legalRepresentativeFiscal:
              this.formTaxdata.controls['legalRepresentativeFiscal'].value,
            legalAddress: this.formTaxdata.controls['address'].value,
            legalLatitude: this.formTaxdata.controls['legalLatitude'].value,
            legalLongitude: this.formTaxdata.controls['legalLongitude'].value,
          };
          this.company = { ...this.company, ...company };
          return this.companyService.updateCompanyProfile({
            ...profile,
            id: profile.id,
          });
        })
      )
      .subscribe({
        next: (profile) => {
          this.company.profile = { ...profile };
          this.authenticationService.myUserSet(this.company);

          this.toastr.success(
            this.translate.instant('IDENTITY.PROFILE_UPDATED')
          );
        },
      });
  }

  async onOpenModalAddressOnTheMap() {
    if (this.disabledForm) return;

    this.formTaxdata.controls['address'].value;
    const modal = await this.modalController.create({
      component: AddressOnTheMapComponent,
      cssClass: 'modal-full-screen',
      backdropDismiss: true,
      componentProps: { dataFlow: this.dataFlow },
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();

    if (data?.dataFlow?.place) {
      this.dataFlow = data.dataFlow;
      this.formTaxdata.controls['address'].setValue(
        this.dataFlow.place.address
      );
    }
  }
}
