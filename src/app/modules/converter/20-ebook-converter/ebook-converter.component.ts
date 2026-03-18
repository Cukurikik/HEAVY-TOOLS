// ============================================================
// FEATURE 20 — EBOOK CONVERTER — Component
// Route: /converter/ebook-converter
// ============================================================
import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { FileDropZoneComponent } from '../shared/components/file-drop-zone/file-drop-zone.component';
import { ConverterFormatSelectorComponent, FormatOption } from '../shared/components/format-selector/format-selector.component';
import { ConverterProgressRingComponent } from '../shared/components/progress-ring/progress-ring.component';
import { ConverterExportPanelComponent } from '../shared/components/export-panel/export-panel.component';
import { EbookConverterActions, selectEbookConverterState } from './ebook-converter.store';
import { ConverterWorkerBridgeService } from '../shared/engine/worker-bridge.service';
import { take } from 'rxjs';

const OUTPUT_FORMATS: FormatOption[] = [
  { value: 'epub', label: 'EPUB', icon: '📚' },
  { value: 'mobi', label: 'MOBI', icon: '📱' },
  { value: 'pdf', label: 'PDF', icon: '📄' },
  { value: 'azw3', label: 'AZW3', icon: '📱' },
  { value: 'fb2', label: 'FB2', icon: '📖' },
];

@Component({
  selector: 'app-ebook-converter',
  standalone: true,
  imports: [CommonModule, FileDropZoneComponent, ConverterFormatSelectorComponent, ConverterProgressRingComponent, ConverterExportPanelComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-[#0a0a0f] p-6 space-y-6">
      <header class="space-y-1">
        <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
          📚 Ebook Converter
        </h1>
        <p class="text-white/50 text-sm">Convert ebooks between EPUB, MOBI, PDF, AZW3, and more formats</p>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <app-file-drop-zone
            accept=".epub,.mobi,.pdf,.azw3,.fb2"
            [multiple]="false"
            label="Drop ebook file here or click to browse"
            (filesSelected)="onFilesSelected($event)" />

          <app-converter-format-selector
            [formats]="outputFormats"
            [selected]="((state$ | async)?.outputFormat ?? 'epub')"
            (formatChange)="onFormatChange($event)" />

          <button
            [disabled]="(state$ | async)?.status === 'processing' || !(state$ | async)?.inputFile"
            (click)="onProcess()"
            class="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2
                   bg-gradient-to-r from-cyan-500 to-blue-500 text-black disabled:opacity-40 disabled:cursor-not-allowed">
            @if ((state$ | async)?.status === 'processing') {
              <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              Processing...
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
              [filename]="'ebook_converted.' + (state$ | async)?.outputFormat"
              (download)="onDownload()" />
          }
        </div>
      </div>
    </div>
  ` })
export class EbookConverterComponent implements OnDestroy {
  private store = inject(Store);
  private bridge = inject(ConverterWorkerBridgeService);
  
  state$ = this.store.select(selectEbookConverterState);
  outputFormats = OUTPUT_FORMATS;

  onFilesSelected(files: File[]): void {
    if (files.length > 0) {
      this.store.dispatch(EbookConverterActions.loadFile({ file: files[0] }));
    }
  }
  onFormatChange(format: string): void {
    this.store.dispatch(EbookConverterActions.setOutputFormat({ format }));
  }
  onProcess(): void {
    this.state$.pipe(take(1)).subscribe(state => {
      if (!state.inputFile) return;
      
      this.store.dispatch(EbookConverterActions.startProcessing());
      
      this.bridge.process<any, { blob: Blob; text: string }>(
        () => new Worker(new URL('./ebook-converter.worker', import.meta.url), { type: 'module' }),
        { file: state.inputFile, outputFormat: state.outputFormat }
      ).subscribe({
        next: (msg) => {
          if (msg.type === 'progress') {
            this.store.dispatch(EbookConverterActions.updateProgress({ progress: msg.value ?? 0 }));
          } else if (msg.type === 'complete' && msg.data) {
            const blob = msg.data.blob;
            this.store.dispatch(EbookConverterActions.processingSuccess({ outputBlob: blob, outputSizeMB: blob.size / 1048576 }));
          } else if (msg.type === 'error') {
            this.store.dispatch(EbookConverterActions.processingFailure({ errorCode: msg.errorCode ?? 'UNKNOWN_ERROR', message: msg.message ?? 'Ebook conversion failed', retryable: true }));
          }
        },
        error: (err) => {
          this.store.dispatch(EbookConverterActions.processingFailure({ errorCode: 'WORKER_CRASHED', message: String(err), retryable: true }));
        }
      });
    });
  }
  onDownload(): void {
    this.store.dispatch(EbookConverterActions.downloadOutput());
  }
  ngOnDestroy(): void {
    this.store.dispatch(EbookConverterActions.resetState());
  }
}
