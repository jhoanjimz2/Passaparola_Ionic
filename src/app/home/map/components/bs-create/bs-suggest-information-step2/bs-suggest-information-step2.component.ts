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
import { Observable, debounceTime, fromEvent, merge } from 'rxjs';

import { IBSDataFlow } from 'src/app/shared/interfaces/business-suggestion/business-suggestion.interface';
import { Country } from 'src/app/shared/interfaces/country/country.interface';
import { CountryService } from 'src/app/shared/services';
import { GenericValidator } from 'src/app/shared/validators/generic-validator';

@Component({
  selector: 'app-bs-suggest-information-step2',
  templateUrl: './bs-suggest-information-step2.component.html',
  styleUrls: ['./bs-suggest-information-step2.component.scss'],
})
export class BsSuggestInformationStep2Component implements OnInit {
  @Input() dataFlow!: IBSDataFlow | any;

  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements!: ElementRef[];
  @ViewChild('owner') owner!: ElementRef;

  codeCountry = '';
  countries: Country[] = [];
  displayMessage: any = {};
  form: FormGroup = {} as FormGroup;
  validationMessages: any;

  private genericValidator!: GenericValidator;

  constructor(
    private countryService: CountryService,
    private formBuild: FormBuilder,
    private modalController: ModalController,
    private translate: TranslateService
  ) {
    this.genericValidator = new GenericValidator();
  }

  async ngOnInit() {
    this.initForm();
    this.getCountries();
  }

  initForm() {
    this.validationMessages = {
      owner: {},
      countryCode: {},
      phoneNumber: {},
      email: {
        email: this.translate.instant('ERROR_MESSAGE.EMAIL'),
      },
    };

    this.form = this.formBuild.group({
      owner: new FormControl(this.dataFlow.owner, []),
      countryCode: new FormControl(this.dataFlow.countryCode, []),
      phoneNumber: new FormControl(this.dataFlow.phoneNumber, []),
      email: new FormControl(this.dataFlow.email, [Validators.email]),
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
      this.owner.nativeElement.focus();
    }, 500);
  }

  onNextStep() {
    this.form.markAllAsTouched();

    if (!this.form.valid) {
      return;
    }

    this.setAllValues();

    this.modalController.dismiss({
      nextStep: true,
      dataFlow: this.dataFlow,
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

    this.dataFlow.country = this.countries.find(
      (country) => country.id === this.dataFlow.countryCode
    );

    if (this.dataFlow?.country?.code)
      this.dataFlow.countryCode = this.dataFlow.country.code;
  }

  getCountries() {
    this.countryService.findAll().subscribe({
      next: (response) => {
        this.countries = response;
      },
      error: (error) => console.error(error),
      complete: () => {},
    });
  }
}
