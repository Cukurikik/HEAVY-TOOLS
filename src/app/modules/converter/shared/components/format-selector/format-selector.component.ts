// ============================================================
// FORMAT SELECTOR COMPONENT — Output format button grid
// File: src/app/modules/converter/shared/components/format-selector/format-selector.component.ts
// ============================================================

import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface FormatOption {
  value: string;
  label: string;
  icon: string;
  badge?: string;
}

@Component({
  selector: 'app-converter-format-selector',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-2">
      <span class="text-xs text-white/40 uppercase tracking-wider font-semibold" style="display: block;">Output Format</span>
      <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
        @for (fmt of formats; track fmt.value) {
          <button
            (click)="onSelect(fmt.value)"
            class="relative p-3 rounded-xl text-center transition-all duration-200 border text-sm font-medium"
            [class.border-cyan-400]="selected === fmt.value"
            [class.bg-cyan-400/10]="selected === fmt.value"
            [class.text-cyan-400]="selected === fmt.value"
            [class.border-white/10]="selected !== fmt.value"
            [class.bg-white/5]="selected !== fmt.value"
            [class.text-white/70]="selected !== fmt.value"
            [class.hover:border-white/30]="selected !== fmt.value"
            [class.hover:bg-white/10]="selected !== fmt.value">
            <span class="text-lg block mb-1">{{ fmt.icon }}</span>
            <span class="text-xs uppercase font-bold tracking-wide">{{ fmt.label }}</span>
            @if (fmt.badge) {
              <span class="absolute -top-1 -right-1 text-[8px] px-1.5 py-0.5 rounded-full bg-accent-purple/80 text-white font-bold">
                {{ fmt.badge }}
              </span>
            }
          </button>
        }
      </div>
    </div>
  `,
})
export class ConverterFormatSelectorComponent {
  @Input() formats: FormatOption[] = [];
  @Input() selected = '';
  @Output() formatChange = new EventEmitter<string>();

  onSelect(value: string): void {
    this.formatChange.emit(value);
  }
}
