// ============================================================
// FEATURE 06 — IMAGE COMPRESSOR — Component
// Route: /converter/image-compressor
// ============================================================
import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { FileDropZoneComponent } from '../shared/components/file-drop-zone/file-drop-zone.component';
import { ConverterFormatSelectorComponent, FormatOption } from '../shared/components/format-selector/format-selector.component';
import { ConverterProgressRingComponent } from '../shared/components/progress-ring/progress-ring.component';
import { ConverterExportPanelComponent } from '../shared/components/export-panel/export-panel.component';
import { ImageCompressorActions, selectImageCompressorState } from './image-compressor.store';
import { ConverterWorkerBridgeService } from '../shared/engine/worker-bridge.service';
import { take } from 'rxjs';

const OUTPUT_FORMATS: FormatOption[] = [
  { value: 'jpeg', label: 'JPEG', icon: '📄' },
  { value: 'png',  label: 'PNG',  icon: '📄' },
  { value: 'webp', label: 'WEBP', icon: '📄' },
];

@Component({
  selector: 'app-image-compressor',
  standalone: true,
  imports: [CommonModule, FileDropZoneComponent, ConverterFormatSelectorComponent, ConverterProgressRingComponent, ConverterExportPanelComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-[#0a0a0f] p-6 space-y-6">
      <header class="space-y-1">
        <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
          📉 Image Compressor
        </h1>
        <p class="text-white/50 text-sm">Compress images with intelligent quality control</p>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <app-file-drop-zone
            accept="image/*"
            [multiple]="false"
            [maxSizeMB]="50"
            label="Drop file here or click to browse"
            (filesSelected)="onFilesSelected($event)" />

          <app-converter-format-selector
            [formats]="outputFormats"
            [selected]="((state$ | async)?.outputFormat ?? 'jpeg')"
            (formatChange)="onFormatChange($event)" />

          <button
            [disabled]="(state$ | async)?.status === 'processing' || !(state$ | async)?.inputFile"
            (click)="onProcess()"
            class="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2
                   bg-gradient-to-r from-cyan-500 to-blue-500 text-black disabled:opacity-40 disabled:cursor-not-allowed">
            @if ((state$ | async)?.status === 'processing') {
              <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              Processing...
            } @else { 📉 Compress }
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
              [filename]="'compressed_' + (state$ | async)?.inputFile?.name"
              (download)="onDownload()" />
          }
        </div>
      </div>
    </div>
  ` })
export class ImageCompressorComponent implements OnDestroy {
  private store = inject(Store);
  private bridge = inject(ConverterWorkerBridgeService);
  
  state$ = this.store.select(selectImageCompressorState);
  outputFormats = OUTPUT_FORMATS;

  onFilesSelected(files: File[]): void {
    if (files.length > 0) {
      this.store.dispatch(ImageCompressorActions.loadFile({ file: files[0] }));
    }
  }
  onFormatChange(format: string): void {
    this.store.dispatch(ImageCompressorActions.setOutputFormat({ format }));
  }
  onProcess(): void {
    this.state$.pipe(take(1)).subscribe(state => {
      if (!state.inputFile) return;
      
      this.store.dispatch(ImageCompressorActions.startProcessing());
      
      this.bridge.process<any, { blob: Blob; text: string }>(
        () => new Worker(new URL('./image-compressor.worker', import.meta.url), { type: 'module' }),
        { file: state.inputFile, outputFormat: state.outputFormat, quality: state.quality, maxSizeMB: state.maxSizeMB }
      ).subscribe({
        next: (msg) => {
          if (msg.type === 'progress') {
            this.store.dispatch(ImageCompressorActions.updateProgress({ progress: msg.value ?? 0 }));
          } else if (msg.type === 'complete' && msg.data) {
            const blob = msg.data.blob;
            this.store.dispatch(ImageCompressorActions.processingSuccess({ outputBlob: blob, outputSizeMB: blob.size / 1048576 }));
          } else if (msg.type === 'error') {
            this.store.dispatch(ImageCompressorActions.processingFailure({ errorCode: msg.errorCode ?? 'UNKNOWN_ERROR', message: msg.message ?? 'Compression failed', retryable: true }));
          }
        },
        error: (err) => {
          this.store.dispatch(ImageCompressorActions.processingFailure({ errorCode: 'WORKER_CRASHED', message: String(err), retryable: true }));
        }
      });
    });
  }
  onDownload(): void {
    this.store.dispatch(ImageCompressorActions.downloadOutput());
  }
  ngOnDestroy(): void {
    this.store.dispatch(ImageCompressorActions.resetState());
  }
}
