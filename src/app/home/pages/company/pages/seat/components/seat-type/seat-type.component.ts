import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import {
  FormBuilder,
  FormControlName,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';

import { Observable, fromEvent, merge, debounceTime } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { SeatService } from 'src/app/shared/services/seat.service';
import { GenericValidator } from 'src/app/shared/validators/generic-validator';
import { SessionService } from 'src/app/shared/services/session.service';

@Component({
  selector: 'app-seat-type',
  templateUrl: './seat-type.component.html',
  styleUrls: ['./seat-type.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule, IonicModule, CommonModule],
})
export class SeatTypeComponent implements OnInit {
  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements!: ElementRef[];

  displayMessage: any = {};
  form: FormGroup = {} as FormGroup;
  storeType: any = '';
  validationMessages: any;
  seatTypes!: any[];
  seatClientTypes!: any[];
  keys: any[] = [];

  private genericValidator!: GenericValidator;

  constructor(
    private modalController: ModalController,
    private translate: TranslateService,
    private formBuild: FormBuilder,
    private seatService: SeatService,
    public sessionService: SessionService
  ) {
    this.genericValidator = new GenericValidator();
  }

  async ngOnInit() {
    this.form = this.formBuild.group({});
    this.getType();
    this.getClientType();
  }

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements.map(
      (formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur')
    );

    merge(this.form.valueChanges, ...controlBlurs)
      .pipe(debounceTime(100))
      .subscribe(() => {
        this.checksValidations();
      });
  }

  async onSave() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      this.checksValidations();
      return;
    }

    const clientsType: any = [];

    this.seatClientTypes.forEach((element) => {
      const checkbox = this.form.get(element.description);
      if (checkbox?.value) clientsType.push(element);
    });

    this.modalController.dismiss({
      type: this.storeType,
      clientsType,
    });
  }

  toggleCheckbox(id: string) {
    for (let index = 0; index < this.seatClientTypes.length; index++) {
      const element = this.seatClientTypes[index];
      const checkbox = this.form.get(element.description);
      if (element.id === id) {
        checkbox?.setValue(!checkbox?.value);
        break;
      }
    }

    this.updateChecked();
  }

  updateChecked() {
    let check = false;

    for (let index = 0; index < this.seatClientTypes.length; index++) {
      const element = this.seatClientTypes[index];
      const checkbox = this.form.get(element.description);
      if (checkbox?.value) {
        check = checkbox?.value;
        break;
      }
    }

    if (check) {
      this.seatClientTypes.forEach((element) => {
        const checkbox = this.form.get(element.description);
        if (!checkbox?.value) {
          checkbox?.clearValidators();
          checkbox?.updateValueAndValidity();
        }
      });
    } else {
      this.seatClientTypes.forEach((element) => {
        const checkbox = this.form.get(element.description);
        checkbox?.setValidators(Validators.requiredTrue);
        checkbox?.updateValueAndValidity();
      });
    }
  }

  private initForm(seatClientTypes: any) {
    const validationMessages: any = {};
    const form: any = {};

    seatClientTypes.forEach((element: any) => {
      validationMessages[element.description] = {
        required: this.translate.instant('ERROR_MESSAGE.REQUIRED'),
      };

      form[element.description] = [false, [Validators.requiredTrue]];
    });

    this.validationMessages = validationMessages;

    this.form = this.formBuild.group(form);

    this.seatClientTypes = seatClientTypes;
  }

  private checksValidations() {
    this.displayMessage = this.genericValidator.processMessages(
      this.form,
      this.validationMessages
    );

    this.keys = Object.keys(this.displayMessage);
  }

  private getType() {
    this.seatService.getType().subscribe({
      next: (response) => {
        this.seatTypes = response;
      },
    });
  }

  private getClientType() {
    this.seatService.getClientType().subscribe({
      next: (response) => {
        this.initForm(response);
      },
    });
  }
}
