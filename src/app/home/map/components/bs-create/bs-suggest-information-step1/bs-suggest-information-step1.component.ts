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
import { Observable, fromEvent, merge, debounceTime } from 'rxjs';

import { IBSDataFlow } from 'src/app/shared/interfaces/business-suggestion/business-suggestion.interface';
import { GenericValidator } from 'src/app/shared/validators/generic-validator';
import { BsAddressOnTheMapComponent } from '../bs-address-on-the-map/bs-address-on-the-map.component';
import { CategoryService } from 'src/app/shared/services/category.service';
import { ICategory } from 'src/app/shared/interfaces/company/category.interface';

@Component({
  selector: 'app-bs-suggest-information-step1',
  templateUrl: './bs-suggest-information-step1.component.html',
  styleUrls: ['./bs-suggest-information-step1.component.scss'],
})
export class BsSuggestInformationStep1Component implements OnInit {
  @Input() dataFlow!: IBSDataFlow | any;

  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements!: ElementRef[];
  @ViewChild('name') name!: ElementRef;

  displayMessage: any = {};
  form: FormGroup = {} as FormGroup;
  validationMessages: any;
  categories!: ICategory[];

  private genericValidator!: GenericValidator;

  constructor(
    private translate: TranslateService,
    private formBuild: FormBuilder,
    private categoryService: CategoryService,
    private modalController: ModalController
  ) {
    this.genericValidator = new GenericValidator();
  }

  async ngOnInit() {
    this.getCategories();
    this.initForm();
  }

  initForm() {
    this.validationMessages = {
      name: {
        required: this.translate.instant('ERROR_MESSAGE.REQUIRED'),
      },
      category: {
        required: this.translate.instant('ERROR_MESSAGE.REQUIRED'),
      },
      address: {
        required: this.translate.instant('ERROR_MESSAGE.REQUIRED'),
      },
    };

    this.form = this.formBuild.group({
      name: new FormControl(this.dataFlow.name, [Validators.required]),
      category: new FormControl(this.dataFlow.category.id || '', [
        Validators.required,
      ]),
      address: new FormControl(this.dataFlow.address, [Validators.required]),
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
      this.name.nativeElement.focus();
    }, 500);
  }

  getCategories() {
    this.categoryService.getAll(1000000, 1).subscribe({
      next: (respose: ICategory[]) => {
        this.categories = respose;
      },
      error: (error) => console.error(error),
      complete: () => {},
    });
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

    this.dataFlow.category = this.categories.find(
      (category) => category.id === this.dataFlow.category
    );
  }

  async onOpenModalBsAddressOnTheMap() {
    const modal = await this.modalController.create({
      component: BsAddressOnTheMapComponent,
      cssClass: 'modal-full-screen',
      backdropDismiss: true,
      componentProps: { dataFlow: this.dataFlow },
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();

    if (data?.dataFlow?.place) {
      this.dataFlow = data.dataFlow;
      this.form.controls['address'].setValue(this.dataFlow.place.address);
    }
  }
}
