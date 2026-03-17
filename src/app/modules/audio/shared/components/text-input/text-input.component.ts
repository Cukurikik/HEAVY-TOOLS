import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-audio-text-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div>
      <span class="text-xs text-white/40" style="display: block;">{{ label }}</span>
      <input
        [type]="type"
        class="w-full bg-white/5 rounded-lg px-3 py-2 text-white text-sm"
        [placeholder]="placeholder"
        [ngModel]="value"
        (ngModelChange)="onValueChange($event)"
        [attr.maxlength]="maxlength ? maxlength : null"
        [attr.min]="min !== undefined ? min : null"
        [attr.max]="max !== undefined ? max : null"
        [attr.step]="step !== undefined ? step : null"
      >
    </div>
  `
})
export class AudioTextInputComponent {
  @Input() label = '';
  @Input() type: 'text' | 'number' = 'text';
  @Input() placeholder = '';
  @Input() maxlength?: number;
  @Input() min?: number;
  @Input() max?: number;
  @Input() step?: number | string;

  @Input() value: unknown;
  @Output() valueChange = new EventEmitter<unknown>();

  onValueChange(newValue: unknown) {
    this.value = newValue;
    this.valueChange.emit(newValue);
  }
}
