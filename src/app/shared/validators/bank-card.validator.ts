import { AbstractControl, ValidatorFn } from '@angular/forms';

export function bankCardValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (!control.value) {
      return null;
    }

    const bankCardPattern =
      /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/;

    if (!bankCardPattern.test(control.value)) {
      return { invalidBankCard: true };
    }

    return null;
  };
}
