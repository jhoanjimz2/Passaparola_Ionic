import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService }    from 'ngx-toastr';

@Directive({
  selector: '[appDecimalValidator]',
})
export class DecimalValidatorDirective implements OnChanges {
  @Input() decimalSeparator: string = ','; // Separador decimal
  @Input() min: number = 0;
  @Input() max: number = 9999999.99; // Ajusta según necesidad
  @Input() maxIntegerDigits: number = 7; // Máximo de dígitos enteros
  @Input() allowDecimals: boolean = true; // Si permite decimales o no

  private regex!: RegExp;
  private specialKeys: string[] = [
    'Backspace',
    'Tab',
    'End',
    'Home',
    'ArrowLeft',
    'ArrowRight',
    'Delete',
  ];

  constructor(
    private el: ElementRef,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {
    this.updateRegex();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['decimalSeparator'] ||
      changes['min'] ||
      changes['max'] ||
      changes['maxIntegerDigits'] ||
      changes['allowDecimals']
    ) {
      this.updateRegex();
    }
  }

  private updateRegex() {
    const escapedSeparator = this.escapeRegExp(this.decimalSeparator);

    if (this.allowDecimals) {
      // Permite números enteros y decimales con coma
      this.regex = new RegExp(`^\\d{1,${this.maxIntegerDigits}}(${escapedSeparator}\\d{0,2})?$`);
    } else {
      // Solo números enteros
      this.regex = new RegExp(`^\\d{1,${this.maxIntegerDigits}}$`);
    }
  }

  private escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  @HostListener('blur', ['$event'])
  onBlur(event: FocusEvent) {
    const inputValue = this.el.nativeElement.value;
    if (!this.isValidNumber(inputValue)) {
      this.el.nativeElement.value = this.min.toString();
      this.toastr.error(
        this.translate.instant('GENERAL.VALUE_SHOULD_BE_BETWEEN', {
          min: this.min,
          max: this.max,
        })
      );
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (this.specialKeys.includes(event.key)) {
      return;
    }

    const current: string = this.el.nativeElement.value;
    const next: string = current.concat(event.key);

    // Permitir la coma si no hay otra en el número
    if (event.key === this.decimalSeparator && this.allowDecimals) {
      if (current.includes(this.decimalSeparator)) {
        event.preventDefault();
      }
      return;
    }

    if (next && !next.match(this.regex)) {
      event.preventDefault();
    }
  }

  private isValidNumber(value: string): boolean {
    if (!value) return false;

    if (this.allowDecimals) {
      return new RegExp(`^\\d{1,${this.maxIntegerDigits}}(\\${this.decimalSeparator}\\d{1,2})?$`).test(value);
    } else {
      return new RegExp(`^\\d{1,${this.maxIntegerDigits}}$`).test(value);
    }
  }
}
