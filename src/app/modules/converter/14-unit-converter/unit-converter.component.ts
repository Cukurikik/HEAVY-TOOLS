// ============================================================
// FEATURE 14 — UNIT CONVERTER — Component
// Route: /converter/unit-converter
// ============================================================
import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { ConverterFormatSelectorComponent, FormatOption } from '../shared/components/format-selector/format-selector.component';
import { ConverterProgressRingComponent } from '../shared/components/progress-ring/progress-ring.component';
import { ConverterExportPanelComponent } from '../shared/components/export-panel/export-panel.component';
import { UnitConverterActions, selectUnitConverterState } from './unit-converter.store';
import { ConverterWorkerBridgeService } from '../shared/engine/worker-bridge.service';
import { take } from 'rxjs';

const OUTPUT_FORMATS: FormatOption[] = [
  { value: 'metric', label: 'METRIC', icon: '📏' },
  { value: 'imperial', label: 'IMPERIAL', icon: '📏' },
  { value: 'scientific', label: 'SCIENTIFIC', icon: '🧪' },
];

@Component({
  selector: 'app-unit-converter',
  standalone: true,
  imports: [CommonModule, ConverterFormatSelectorComponent, ConverterProgressRingComponent, ConverterExportPanelComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-[#0a0a0f] p-6 space-y-6">
      <header class="space-y-1">
        <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
          📏 Unit Converter
        </h1>
        <p class="text-white/50 text-sm">Convert Length, Weight, Temperature, Area, Volume, and more</p>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <div class="relative group">
            <textarea
              [value]="((state$ | async)?.inputText ?? '')"
              (input)="onTextInput($any($event.target).value)"
              placeholder="Enter value and unit (e.g. 100 kg to lbs)..."
              class="w-full h-32 p-4 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-lg focus:outline-none focus:border-cyan-400/50 transition-all resize-none"></textarea>
          </div>

          <app-converter-format-selector
            [formats]="outputFormats"
            [selected]="((state$ | async)?.outputFormat ?? 'metric')"
            (formatChange)="onFormatChange($event)" />

          <button
            [disabled]="(state$ | async)?.status === 'processing' || !(state$ | async)?.inputText"
            (click)="onProcess()"
            class="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2
                   bg-gradient-to-r from-cyan-500 to-blue-500 text-black disabled:opacity-40 disabled:cursor-not-allowed">
            @if ((state$ | async)?.status === 'processing') {
              <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              Converting...
            } @else { 🚀 Convert }
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
              <app-converter-progress-ring [progress]="(state$ | async)?.progress ?? 0"></app-converter-progress-ring>
            </div>
          }
          @if ((state$ | async)?.status === 'done') {
            <app-converter-export-panel
              [outputBlob]="((state$ | async)?.outputBlob ?? null)"
              [outputSizeMB]="((state$ | async)?.outputSizeMB ?? null)"
              [filename]="'unit_result.txt'"
              (download)="onDownload()" />
          }
        </div>
      </div>
    </div>
  ` })
export class UnitConverterComponent implements OnDestroy {
  private store = inject(Store);
  private bridge = inject(ConverterWorkerBridgeService);
  
  state$ = this.store.select(selectUnitConverterState);
  outputFormats = OUTPUT_FORMATS;

  onTextInput(text: string): void {
    this.store.dispatch(UnitConverterActions.setInputText({ text }));
  }
  onFormatChange(format: string): void {
    this.store.dispatch(UnitConverterActions.setOutputFormat({ format }));
  }
  onProcess(): void {
    this.state$.pipe(take(1)).subscribe(state => {
      if (!state.inputText) return;
      
      this.store.dispatch(UnitConverterActions.startProcessing());
      
      this.bridge.process<any, { blob: Blob; text: string }>(
        () => new Worker(new URL('./unit-converter.worker', import.meta.url), { type: 'module' }),
        { inputText: state.inputText, outputFormat: state.outputFormat, fromUnit: state.fromUnit, toUnit: state.toUnit }
      ).subscribe({
        next: (msg) => {
          if (msg.type === 'progress') {
            this.store.dispatch(UnitConverterActions.updateProgress({ progress: msg.value ?? 0 }));
          } else if (msg.type === 'complete' && msg.data) {
            const blob = msg.data.blob;
            this.store.dispatch(UnitConverterActions.processingSuccess({ outputBlob: blob, outputSizeMB: blob.size / 1048576 }));
          } else if (msg.type === 'error') {
            this.store.dispatch(UnitConverterActions.processingFailure({ errorCode: msg.errorCode ?? 'UNKNOWN_ERROR', message: msg.message ?? 'Conversion failed', retryable: true }));
          }
        },
        error: (err) => {
          this.store.dispatch(UnitConverterActions.processingFailure({ errorCode: 'WORKER_CRASHED', message: String(err), retryable: true }));
        }
      });
    });
  }
  onDownload(): void {
    this.store.dispatch(UnitConverterActions.downloadOutput());
  }
  ngOnDestroy(): void {
    this.store.dispatch(UnitConverterActions.resetState());
  }
}
