import {
  Component,
  ViewChildren,
  QueryList,
  ElementRef,
  forwardRef,
  AfterViewInit,
  Input,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-pin-input',
  templateUrl: './pin-input.component.html',
  styleUrls: ['./pin-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PinInputComponent),
      multi: true,
    },
  ],
})
export class PinInputComponent implements ControlValueAccessor, AfterViewInit {
  @Input() notViewIconEye: boolean = true;

  @ViewChildren('pin0, pin1, pin2, pin3, pin4')
  pinInputs!: QueryList<ElementRef>;

  isPassword: boolean = true;
  pin: string[] = ['', '', '', '', ''];

  onChange: any = () => {};
  onTouched: any = () => {};

  ngAfterViewInit(): void {
    this.updateInputs();
  }

  writeValue(value: string): void {
    if (value) {
      this.pin = value.split('');
      this.updateInputs();
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    if (this.pinInputs) {
      this.pinInputs.forEach(
        (input) => (input.nativeElement.disabled = isDisabled)
      );
    }
  }

  onInput(event: any, index: number): void {
    const input = event.target;
    const value = input.value;

    if (value.length === 1) {
      this.pin[index] = value;
      if (index < 4) {
        this.pinInputs.toArray()[index + 1].nativeElement.focus();
      }
    } else if (value.length > 1) {
      input.value = value.charAt(0);
      this.pin[index] = value.charAt(0);
    } else {
      this.pin[index] = '';
    }

    this.onChange(this.pin.join(''));
    this.onTouched();
  }

  onKeyDown(event: KeyboardEvent, index: number): void {
    const input = event.target as HTMLInputElement;

    if (event.key === 'Backspace' && input.value === '' && index > 0) {
      this.pinInputs.toArray()[index - 1].nativeElement.focus();
    } else if (
      !/[0-9]/.test(event.key) &&
      event.key !== 'Backspace' &&
      event.key !== 'ArrowLeft' &&
      event.key !== 'ArrowRight'
    ) {
      event.preventDefault();
    }
  }

  togglePasswordVisibility(): void {
    this.isPassword = !this.isPassword;
  }

  private updateInputs(): void {
    if (this.pinInputs) {
      this.pinInputs.forEach((input, index) => {
        input.nativeElement.value = this.pin[index] || '';
      });
    }
  }
}
