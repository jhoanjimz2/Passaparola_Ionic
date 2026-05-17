import { AbstractControl, ValidatorFn } from '@angular/forms';

export class PasswordMatcher {
  static match(pin: string, repeatPin: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const pinControl = control.get(pin);
      const repeatPinControl = control.get(repeatPin);

      if (!pinControl || !repeatPinControl) {
        return null; // No hacemos nada si no encontramos los controles
      }

      if (pinControl.pristine || repeatPinControl.pristine) {
        return null; // No validamos si los controles están prístinos
      }

      if (pinControl.value === repeatPinControl.value) {
        return null; // No hay error si los valores coinciden
      }

      repeatPinControl.setErrors({ match: true }); // Establecemos un error si los valores no coinciden
      return { match: true };
    };
  }
}
