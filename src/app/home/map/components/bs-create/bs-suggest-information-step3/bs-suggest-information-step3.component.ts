import {
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormControlName,
  FormGroup,
  Validators,
} from '@angular/forms';

import { ModalController } from '@ionic/angular';

import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, fromEvent, merge, debounceTime } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

import {
  IBSDataFlow,
  IBusinessSuggestion,
} from 'src/app/shared/interfaces/business-suggestion/business-suggestion.interface';
import { UploadService } from 'src/app/shared/services';
import { BusinessSuggestionService } from 'src/app/shared/services/business-suggestion.service';
import { GenericValidator } from 'src/app/shared/validators/generic-validator';
import { AuthenticationService } from 'src/app/core/service/authentication.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-bs-suggest-information-step3',
  templateUrl: './bs-suggest-information-step3.component.html',
  styleUrls: ['./bs-suggest-information-step3.component.scss'],
})
export class BsSuggestInformationStep3Component implements OnInit {
  @Input() dataFlow!: IBSDataFlow | any;

  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements!: ElementRef[];
  @ViewChild('description') description!: ElementRef;

  displayMessage: any = {};
  form: FormGroup = {} as FormGroup;
  validationMessages: any;

  private genericValidator!: GenericValidator;
  saving = false;

  constructor(
    private businessSuggestionService: BusinessSuggestionService,
    private uploadService: UploadService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private formBuild: FormBuilder,
    private modalController: ModalController,
    private authenticationService: AuthenticationService,
    private spinner: NgxSpinnerService
  ) {
    this.genericValidator = new GenericValidator();
  }

  async ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.validationMessages = {
      description: {
        required: this.translate.instant('ERROR_MESSAGE.REQUIRED'),
        maxlength: this.translate.instant('ERROR_MESSAGE.MAX_LENGTH'),
      },
    };

    this.form = this.formBuild.group({
      description: new FormControl(this.dataFlow.description, [
        Validators.required,
        Validators.maxLength(250),
      ]),
    });
  }

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements.map(
      (formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur')
    );

    merge(this.form.valueChanges, ...controlBlurs)
      .pipe(debounceTime(100))
      .subscribe(() => {
        this.displayMessage = this.genericValidator.processMessages(
          this.form,
          this.validationMessages
        );
      });

    setTimeout(() => {
      this.description.nativeElement.focus();
    }, 500);
  }

  onNextStep() {
    this.form.markAllAsTouched();

    if (!this.form.valid) {
      return;
    }

    this.setAllValues();

    this.createBs();
  }

  async createBs() {
    this.saving = true;
    this.spinner.show();
    const arrayTypeFile = this.dataFlow.pictureFile!.type.split('/');
    const type = arrayTypeFile[1];
    const path = `passaparola/business-suggestions/pictures/${uuidv4()}.${type}`;

    const fileUpload = await this.uploadService.uploadFile(
      this.dataFlow.pictureFile!,
      path
    );

    if (!fileUpload) {
      this.toastr.error(
        this.translate.instant('BUSINESS_SUGGESTION.ERROR_UP_IMG')
      );
      this.spinner.hide();
      this.saving = false;
      return;
    }

    const body: IBusinessSuggestion = {
      address: this.dataFlow.address,
      category: this.dataFlow.category,
      country: this.authenticationService.user.country,
      countryCode: this.authenticationService.user.country.code,
      // countryCode: this.dataFlow.countryCode,
      description: this.dataFlow.description,
      email: this.dataFlow.email,
      latitude: this.dataFlow.place.location.lat().toString(),
      longitude: this.dataFlow.place.location.lng().toString(),
      name: this.dataFlow.name,
      owner: this.dataFlow.owner,
      phoneNumber: this.dataFlow.phoneNumber.toString(),
      urlImage: `https://s3youetix.s3.nl-ams.scw.cloud/${path}`,
    };
    this.businessSuggestionService.create(body).subscribe({
      next: () => {
        this.modalController.dismiss({
          nextStep: true,
          dataFlow: this.dataFlow,
        });
        this.saving = false;
      },
      error: (error) => console.error(error),
      complete: () => {},
    });
  }

  onPreviousStep() {
    this.setAllValues();

    this.modalController.dismiss({
      previousStep: true,
      dataFlow: this.dataFlow,
    });
  }

  setAllValues() {
    for (const key in this.form.controls) {
      if (Object.prototype.hasOwnProperty.call(this.form.controls, key)) {
        this.dataFlow[key] = this.form.controls[key].value;
      }
    }
  }
}
