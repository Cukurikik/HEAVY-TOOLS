// ============================================================
// FEATURE 25 — QR CODE GENERATOR — Component
// Route: /converter/qr-generator
// ============================================================
import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { ConverterFormatSelectorComponent, FormatOption } from '../shared/components/format-selector/format-selector.component';
import { ConverterProgressRingComponent } from '../shared/components/progress-ring/progress-ring.component';
import { ConverterExportPanelComponent } from '../shared/components/export-panel/export-panel.component';
import { QrGeneratorActions, selectQrGeneratorState } from './qr-generator.store';
import { ConverterWorkerBridgeService } from '../shared/engine/worker-bridge.service';
import { take } from 'rxjs';

const OUTPUT_FORMATS: FormatOption[] = [
  { value: 'png', label: 'PNG', icon: '🖼️' },
  { value: 'svg', label: 'SVG', icon: '🚀' },
  { value: 'jpg', label: 'JPG', icon: '🖼️' },
];

@Component({
  selector: 'app-qr-generator',
  standalone: true,
  imports: [CommonModule, ConverterFormatSelectorComponent, ConverterProgressRingComponent, ConverterExportPanelComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-[#0a0a0f] p-6 space-y-6">
      <header class="space-y-1">
        <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
          📱 QR Code Generator
        </h1>
        <p class="text-white/50 text-sm">Generate customizable QR codes for URLs, text, Wi-Fi, and more</p>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <div class="relative group">
            <textarea
              [value]="((state$ | async)?.inputText ?? '')"
              (input)="onTextInput($any($event.target).value)"
              placeholder="Enter URL or text for the QR code..."
              class="w-full h-32 p-4 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-lg focus:outline-none focus:border-cyan-400/50 transition-all resize-none"></textarea>
          </div>

          <app-converter-format-selector
            [formats]="outputFormats"
            [selected]="((state$ | async)?.outputFormat ?? 'png')"
            (formatChange)="onFormatChange($event)" />

          <button
            [disabled]="(state$ | async)?.status === 'processing' || !(state$ | async)?.inputText"
            (click)="onProcess()"
            class="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2
                   bg-gradient-to-r from-cyan-500 to-blue-500 text-black disabled:opacity-40 disabled:cursor-not-allowed">
            @if ((state$ | async)?.status === 'processing') {
              <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              Generating...
            } @else { 🚀 Generate }
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
             <div class="bg-white p-4 rounded-xl flex justify-center mb-4">
                <img [src]="qrPreviewUrl()" class="w-64 h-64 object-contain" alt="QR Preview" />
             </div>
            <app-converter-export-panel
              [outputBlob]="((state$ | async)?.outputBlob ?? null)"
              [outputSizeMB]="((state$ | async)?.outputSizeMB ?? null)"
              [filename]="'qrcode.' + (state$ | async)?.outputFormat"
              (download)="onDownload()" />
          }
        </div>
      </div>
    </div>
  ` })
export class QrGeneratorComponent implements OnDestroy {
  private store = inject(Store);
  private bridge = inject(ConverterWorkerBridgeService);
  
  state$ = this.store.select(selectQrGeneratorState);
  outputFormats = OUTPUT_FORMATS;
  private _previewUrl: string | null = null;

  qrPreviewUrl() {
    this.state$.pipe(take(1)).subscribe(state => {
      if (state.outputBlob && !this._previewUrl) {
        this._previewUrl = URL.createObjectURL(state.outputBlob);
      }
    });
    return this._previewUrl;
  }

  onTextInput(text: string): void {
    this.store.dispatch(QrGeneratorActions.setInputText({ text }));
  }
  onFormatChange(format: string): void {
    this.store.dispatch(QrGeneratorActions.setOutputFormat({ format }));
  }
  onProcess(): void {
    this.state$.pipe(take(1)).subscribe(state => {
      if (!state.inputText) return;
      
      this.store.dispatch(QrGeneratorActions.startProcessing());
      if (this._previewUrl) URL.revokeObjectURL(this._previewUrl);
      this._previewUrl = null;

      this.bridge.process<any, { blob: Blob; text: string }>(
        () => new Worker(new URL('./qr-generator.worker', import.meta.url), { type: 'module' }),
        { inputText: state.inputText, outputFormat: state.outputFormat, size: state.size, ecc: state.eccLevel, color: state.color, bgColor: state.bgColor }
      ).subscribe({
        next: (msg) => {
          if (msg.type === 'progress') {
            this.store.dispatch(QrGeneratorActions.updateProgress({ progress: msg.value ?? 0 }));
          } else if (msg.type === 'complete' && msg.data) {
            const blob = msg.data.blob;
            this.store.dispatch(QrGeneratorActions.processingSuccess({ outputBlob: blob, outputSizeMB: blob.size / 1048576 }));
          } else if (msg.type === 'error') {
            this.store.dispatch(QrGeneratorActions.processingFailure({ errorCode: msg.errorCode ?? 'UNKNOWN_ERROR', message: msg.message ?? 'Generation failed', retryable: true }));
          }
        },
        error: (err) => {
          this.store.dispatch(QrGeneratorActions.processingFailure({ errorCode: 'WORKER_CRASHED', message: String(err), retryable: true }));
        }
      });
    });
  }
  onDownload(): void {
    this.store.dispatch(QrGeneratorActions.downloadOutput());
  }
  ngOnDestroy(): void {
    if (this._previewUrl) URL.revokeObjectURL(this._previewUrl);
    this.store.dispatch(QrGeneratorActions.resetState());
  }
}
