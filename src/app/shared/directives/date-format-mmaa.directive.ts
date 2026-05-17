import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[dateFormatMMAA]',
})
export class DateFormatMMAADirective {
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const key = event.key;
    const input = event.target as HTMLInputElement;
    const inputValue = input.value;
    const selectionStart: any = input.selectionStart;
    const selectionEnd: any = input.selectionEnd;

    // Permitir las teclas de flecha y las teclas de inicio y fin para la navegación
    if (
      key === 'ArrowLeft' ||
      key === 'ArrowRight' ||
      key === 'Home' ||
      key === 'End' ||
      key === 'Backspace' ||
      key === 'Delete' ||
      key === 'Tab' // También permitir la tecla Tab para cambiar de campo
    ) {
      return;
    }

    // Validación para formato de fecha MM/AA o M/AA
    const newValue =
      inputValue.substring(0, selectionStart) +
      key +
      inputValue.substring(selectionEnd);
    const datePattern = /^(0?[1-9]|1[0-2])?(\/\d{0,2})?$/;

    // Permitir solo números y la barra "/" y restringir a un máximo de 5 caracteres
    if (
      (inputValue.length >= 5 && key !== 'Backspace') ||
      !datePattern.test(newValue)
    ) {
      event.preventDefault();
    }
  }
}
