// ============================================================
// FEATURE 13 — COLOR CONVERTER — Component
// Route: /converter/color-converter
// ============================================================
import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { ConverterFormatSelectorComponent, FormatOption } from '../shared/components/format-selector/format-selector.component';
import { ConverterProgressRingComponent } from '../shared/components/progress-ring/progress-ring.component';
import { ColorConverterActions, selectColorConverterState } from './color-converter.store';

const OUTPUT_FORMATS: FormatOption[] = [
  { value: 'hex', label: 'HEX', icon: '📄' },
  { value: 'rgb', label: 'RGB', icon: '📄' },
  { value: 'hsl', label: 'HSL', icon: '📄' },
  { value: 'hsv', label: 'HSV', icon: '📄' },
  { value: 'cmyk', label: 'CMYK', icon: '📄' },
  { value: 'lab', label: 'LAB', icon: '📄' },
];

@Component({
  selector: 'app-color-converter',
  standalone: true,
  imports: [CommonModule, ConverterFormatSelectorComponent, ConverterProgressRingComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-[#0a0a0f] p-6 space-y-6">
    <div class="max-w-7xl mx-auto space-y-8 animate-fade-in-up">
      <div class="relative bg-[#0a0a0f]/80 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden">
        <div class="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="relative z-10 space-y-8">
      <header class="space-y-1">
        <h1 class="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 drop-shadow-lg tracking-tight" class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
          🎨 Color Converter
        </h1>
        <p class="text-white/50 text-sm">Convert colors between HEX, RGB, HSL, HSV, CMYK, and more</p>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <!-- Text input mode for utility converters -->
          <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <label class="text-xs text-white/40 uppercase tracking-wider font-semibold">Input</label>
            <textarea
              rows="6"
              placeholder="Enter value to convert..."
              (input)="onInputChange(($any($event.target)).value)"
              class="w-full px-3 py-2 text-sm bg-white/5 border border-white/15 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-cyan-400 resize-none font-mono"></textarea>
          </div>

          <app-converter-format-selector
            [formats]="outputFormats"
            [selected]="(state$ | async)?.outputFormat ?? 'hex'"
            (formatChange)="onFormatChange($event)" />

          <button
            [disabled]="(state$ | async)?.status === 'processing'"
            (click)="onProcess()"
            class="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2
                   bg-gradient-to-r from-cyan-500 to-blue-500 text-black disabled:opacity-40 disabled:cursor-not-allowed">
            @if ((state$ | async)?.status === 'processing') {
              <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              Processing...
            } @else { 🎨 Convert }
          </button>

          @if ((state$ | async)?.status === 'error') {
            <div class="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400">
              ⚠️ {{ (state$ | async)?.errorMessage }}
            </div>
          }
        </div>

        <div class="space-y-4">
          @if ((state$ | async)?.status === 'processing') {
            <div class="flex justify-center p-8">
              <app-converter-progress-ring [progress]="(state$ | async)?.progress ?? 0" label="Converting..." />
            </div>
          }
          @if ((state$ | async)?.outputText) {
            <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div class="flex items-center justify-between">
                <label class="text-xs text-white/40 uppercase tracking-wider font-semibold">Output</label>
                <button (click)="onCopy()" class="text-xs text-cyan-400 hover:text-cyan-300">📋 Copy</button>
              </div>
              <pre class="text-sm text-white/80 font-mono whitespace-pre-wrap break-all bg-white/5 p-3 rounded-lg max-h-64 overflow-auto">{{ (state$ | async)?.outputText }}</pre>
            </div>
          }
        </div>
      </div>
          </div>
      </div>
    </div>
  </div>
  `,
})
export class ColorConverterComponent implements OnDestroy {
  private store = inject(Store);
  state$ = this.store.select(selectColorConverterState);
  outputFormats = OUTPUT_FORMATS;

  onInputChange(value: string): void {
    this.store.dispatch(ColorConverterActions.setInputText({ text: value }));
  }
  onCopy(): void {
    this.store.dispatch(ColorConverterActions.copyToClipboard());
  }
  onFormatChange(format: string): void {
    this.store.dispatch(ColorConverterActions.setOutputFormat({ format }));
  }
  onProcess(): void {
    this.store.dispatch(ColorConverterActions.startProcessing());
  }
  ngOnDestroy(): void {
    this.store.dispatch(ColorConverterActions.resetState());
  }
}
