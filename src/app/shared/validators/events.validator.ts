import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function required(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const errors: ValidationErrors = control.errors || {};

    if (!control.value || control.value.trim() === '') {
      errors['required'] = 'Questo campo è obbligatorio';
    } else {
      delete errors['required'];
    }

    return Object.keys(errors).length ? errors : null;
  };
}
export function requiredAndNumeric(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value?.toString().trim();
    const errors: ValidationErrors = {};

    // Validación de campo obligatorio
    if (!value) {
      errors['required'] = 'Questo campo è obbligatorio';
    }

    // Expresión regular para validar solo números con "," como separador decimal
    const numericRegex = /^\d+(,\d{1,2})?$/;

    if (value && !numericRegex.test(value)) {
      errors['numeric'] = 'Deve essere un valore numerico con "," come separatore decimale';
    }

    return Object.keys(errors).length ? errors : null;
  };
}

export function requiredAndNumericMin10(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value?.toString().trim();
    const errors: ValidationErrors = {};

    // Validación de campo obligatorio
    if (!value) {
      errors['required'] = 'Questo campo è obbligatorio';
    }

    // Expresión regular para validar solo números con "," como separador decimal
    const numericRegex = /^\d+(,\d{1,2})?$/;

    if (value && !numericRegex.test(value)) {
      errors['numeric'] = 'Deve essere un valore numerico con "," come separatore decimale';
    }

    // Validación de valor mínimo (10)
    const numericValue = parseFloat(value.replace(',', '.')); // Convertir a número
    if (!isNaN(numericValue) && numericValue < 10) {
      errors['min'] = 'Il valore minimo è 10';
    }

    return Object.keys(errors).length ? errors : null;
  };
}


export function min10(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value?.toString().trim();
    const errors: ValidationErrors = control.errors || {};

    if (!value) {
      errors['required'] = 'Questo campo è obbligatorio';
    } else {
      delete errors['required'];
    }

    if (value && !/^\d*\.?\d+$/.test(value)) {
      errors['numeric'] = 'Deve essere un valore numerico';
    } else {
      delete errors['numeric'];
    }

    const numericValue = parseFloat(value);
    if (value && numericValue < 10) {
      errors['minValue'] = 'Il valore non può essere inferiore a 10';
    } else {
      delete errors['minValue'];
    }

    return Object.keys(errors).length ? errors : null;
  };
}


export function requiredWithMaxLength(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const errors: ValidationErrors = control.errors || {};

    if (!control.value || control.value.trim() === '') {
      errors['required'] = 'Questo campo è obbligatorio';
    } else {
      delete errors['required'];
    }

    if (control.value?.toString().trim().length > 255) {
      errors['maxLength'] = 'Il testo non può superare i 255 caratteri';
    } else {
      delete errors['maxLength'];
    }

    return Object.keys(errors).length ? errors : null;
  };
}

export function maxLength(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const errors: ValidationErrors = control.errors || {};

    if (control.value?.toString().trim().length > 255) {
      errors['maxLength'] = 'Il testo non può superare i 255 caratteri';
    } else {
      delete errors['maxLength'];
    }

    return Object.keys(errors).length ? errors : null;
  };
}
