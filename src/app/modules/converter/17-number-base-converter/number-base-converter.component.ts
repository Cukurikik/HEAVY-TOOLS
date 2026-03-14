// ============================================================
// FEATURE 17 — NUMBER BASE CONVERTER — Component
// Route: /converter/number-base-converter
// ============================================================
import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { ConverterFormatSelectorComponent, FormatOption } from '../shared/components/format-selector/format-selector.component';
import { ConverterProgressRingComponent } from '../shared/components/progress-ring/progress-ring.component';
import { NumberBaseConverterActions, selectNumberBaseConverterState } from './number-base-converter.store';

const OUTPUT_FORMATS: FormatOption[] = [
  { value: 'binary', label: 'BINARY', icon: '📄' },
  { value: 'octal', label: 'OCTAL', icon: '📄' },
  { value: 'decimal', label: 'DECIMAL', icon: '📄' },
  { value: 'hex', label: 'HEX', icon: '📄' },
  { value: 'base32', label: 'BASE32', icon: '📄' },
  { value: 'base64', label: 'BASE64', icon: '📄' },
];

@Component({
  selector: 'app-number-base-converter',
  standalone: true,
  imports: [CommonModule, ConverterFormatSelectorComponent, ConverterProgressRingComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-[#0a0a0f] p-6 space-y-6">
      <header class="space-y-1">
        <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
          🔢 Number Base Converter
        </h1>
        <p class="text-white/50 text-sm">Convert numbers between binary, octal, decimal, hexadecimal, and custom bases</p>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <!-- Text input mode for utility converters -->
          <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <span class="text-xs text-white/40 uppercase tracking-wider font-semibold" style="display: block;">Input</span>
            <textarea
              rows="6"
              placeholder="Enter value to convert..."
              (input)="onInputChange(($any($event.target)).value)"
              class="w-full px-3 py-2 text-sm bg-white/5 border border-white/15 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-cyan-400 resize-none font-mono"></textarea>
          </div>

          <app-converter-format-selector
            [formats]="outputFormats"
            [selected]="(state$ | async)?.outputFormat ?? 'binary'"
            (formatChange)="onFormatChange($event)" />

          <button
            [disabled]="(state$ | async)?.status === 'processing'"
            (click)="onProcess()"
            class="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2
                   bg-gradient-to-r from-cyan-500 to-blue-500 text-black disabled:opacity-40 disabled:cursor-not-allowed">
            @if ((state$ | async)?.status === 'processing') {
              <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              Processing...
            } @else { 🔢 Convert }
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
                <span class="text-xs text-white/40 uppercase tracking-wider font-semibold" style="display: block;">Output</span>
                <button (click)="onCopy()" class="text-xs text-cyan-400 hover:text-cyan-300">📋 Copy</button>
              </div>
              <pre class="text-sm text-white/80 font-mono whitespace-pre-wrap break-all bg-white/5 p-3 rounded-lg max-h-64 overflow-auto">{{ (state$ | async)?.outputText }}</pre>
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class NumberBaseConverterComponent implements OnDestroy {
  private store = inject(Store);
  state$ = this.store.select(selectNumberBaseConverterState);
  outputFormats = OUTPUT_FORMATS;

  onInputChange(value: string): void {
    this.store.dispatch(NumberBaseConverterActions.setInputText({ text: value }));
  }
  onCopy(): void {
    this.store.dispatch(NumberBaseConverterActions.copyToClipboard());
  }
  onFormatChange(format: string): void {
    this.store.dispatch(NumberBaseConverterActions.setOutputFormat({ format }));
  }
  onProcess(): void {
    this.store.dispatch(NumberBaseConverterActions.startProcessing());
  }
  ngOnDestroy(): void {
    this.store.dispatch(NumberBaseConverterActions.resetState());
  }
}
