import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-form-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormInputComponent),
      multi: true
    }
  ],
  template: `<label class="form-group">
    <div class="label">{{ label }}</div>
    <input [type]="type" [placeholder]="placeholder" [ngModel]="value" (ngModelChange)="onInput($event)" [disabled]="disabled" />
  </label>`,
  styles: [`.form-group{display:flex;flex-direction:column;gap:6px}.label{font-weight:600;color:rgba(0,0,0,0.7)}input{padding:8px 10px;border-radius:8px;border:1px solid rgba(0,0,0,0.08)}`]
})
export class FormInputComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() type = 'text';

  value: unknown = null;
  disabled = false;

  private onChange: (v: unknown) => void = () => { /* noop */ };
  private onTouched: () => void = () => { /* noop */ };

  // called from host (parent) via ngModel
  writeValue(value: unknown): void {
    this.value = value;
  }

  registerOnChange(fn: (v: unknown) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(v: unknown) {
    this.value = v;
    this.onChange(v);
  }
}
