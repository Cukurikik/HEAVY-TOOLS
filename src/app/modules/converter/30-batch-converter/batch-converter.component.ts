// ============================================================
// FEATURE 30 — BATCH CONVERTER — Component
// Route: /converter/batch-converter
// ============================================================
import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { FileDropZoneComponent } from '../shared/components/file-drop-zone/file-drop-zone.component';
import { ConverterFormatSelectorComponent, FormatOption } from '../shared/components/format-selector/format-selector.component';
import { ConverterProgressRingComponent } from '../shared/components/progress-ring/progress-ring.component';
import { ConverterExportPanelComponent } from '../shared/components/export-panel/export-panel.component';
import { BatchConverterActions, selectBatchConverterState } from './batch-converter.store';
import { ConverterWorkerBridgeService } from '../shared/engine/worker-bridge.service';
import { take } from 'rxjs';

const OUTPUT_FORMATS: FormatOption[] = [
  { value: 'zip-all', label: 'ZIP (All Files)', icon: '📦' },
  { value: 'individual', label: 'Individual Downloads', icon: '📄' },
];

@Component({
  selector: 'app-batch-converter',
  standalone: true,
  imports: [CommonModule, FileDropZoneComponent, ConverterFormatSelectorComponent, ConverterProgressRingComponent, ConverterExportPanelComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-[#0a0a0f] p-6 space-y-6">
      <header class="space-y-1">
        <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
          ⚡ Batch Converter
        </h1>
        <p class="text-white/50 text-sm">Convert multiple files simultaneously with high-speed automated queue</p>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <app-file-drop-zone
            accept="*/*"
            [multiple]="true"
            label="Drop multiple files here for batch processing"
            (filesSelected)="onFilesSelected($event)" />

          <div class="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
            <p class="text-xs text-white/40 uppercase tracking-widest font-bold">Queue ({{ ((state$ | async)?.inputFiles?.length ?? 0) }} files)</p>
            <div class="max-h-32 overflow-y-auto space-y-1 custom-scrollbar">
              @for (file of (state$ | async)?.inputFiles; track file.name) {
                <div class="flex items-center justify-between text-xs text-white/60 p-2 bg-white/5 rounded-lg">
                   <span>{{ file.name }}</span>
                   <span>{{ (file.size / 1024).toFixed(1) }} KB</span>
                </div>
              } @empty {
                <p class="text-xs text-white/20 italic text-center py-4">No files in queue</p>
              }
            </div>
          </div>

          <app-converter-format-selector
            [formats]="outputFormats"
            [selected]="((state$ | async)?.outputFormat ?? 'zip-all')"
            (formatChange)="onFormatChange($event)" />

          <button
            [disabled]="(state$ | async)?.status === 'processing' || !((state$ | async)?.inputFiles?.length)"
            (click)="onProcess()"
            class="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2
                   bg-gradient-to-r from-cyan-500 to-blue-500 text-black disabled:opacity-40 disabled:cursor-not-allowed">
            @if ((state$ | async)?.status === 'processing') {
              <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              Processing Queue...
            } @else { ⚡ Start Batch }
          </button>

          @if ((state$ | async)?.status === 'error') {
            <div class="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400">
              ⚠️ {{ (state$ | async)?.errorMessage }}
            </div>
          }
        </div>

        <div class="space-y-4">
          @if ((state$ | async)?.status === 'processing') {
            <div class="flex flex-col items-center gap-4 p-8">
              <app-converter-progress-ring [progress]="(state$ | async)?.progress ?? 0"></app-converter-progress-ring>
              <p class="text-cyan-400 text-xs animate-pulse">Running automation engine...</p>
            </div>
          }
          @if ((state$ | async)?.status === 'done') {
            <app-converter-export-panel
              [outputBlob]="((state$ | async)?.outputBlob ?? null)"
              [outputSizeMB]="((state$ | async)?.outputSizeMB ?? null)"
              [filename]="'batch_result.zip'"
              (download)="onDownload()" />
          }
        </div>
      </div>
    </div>
  ` })
export class BatchConverterComponent implements OnDestroy {
  private store = inject(Store);
  private bridge = inject(ConverterWorkerBridgeService);
  
  state$ = this.store.select(selectBatchConverterState);
  outputFormats = OUTPUT_FORMATS;

  onFilesSelected(files: File[]): void {
    if (files.length > 0) {
      this.store.dispatch(BatchConverterActions.loadFiles({ files }));
    }
  }
  onFormatChange(format: string): void {
    this.store.dispatch(BatchConverterActions.setOutputFormat({ format }));
  }
  onProcess(): void {
    this.state$.pipe(take(1)).subscribe(state => {
      if (!state.inputFiles?.length) return;
      
      this.store.dispatch(BatchConverterActions.startProcessing());
      
      this.bridge.process<any, { blob: Blob; text: string }>(
        () => new Worker(new URL('./batch-converter.worker', import.meta.url), { type: 'module' }),
        { files: state.inputFiles, outputFormat: state.outputFormat, concurrent: state.concurrentTasks }
      ).subscribe({
        next: (msg) => {
          if (msg.type === 'progress') {
            this.store.dispatch(BatchConverterActions.updateProgress({ progress: msg.value ?? 0 }));
          } else if (msg.type === 'complete' && msg.data) {
            const blob = msg.data.blob;
            this.store.dispatch(BatchConverterActions.processingSuccess({ outputBlob: blob, outputSizeMB: blob.size / 1048576 }));
          } else if (msg.type === 'error') {
            this.store.dispatch(BatchConverterActions.processingFailure({ errorCode: msg.errorCode ?? 'UNKNOWN_ERROR', message: msg.message ?? 'Batch processing failed', retryable: true }));
          }
        },
        error: (err) => {
          this.store.dispatch(BatchConverterActions.processingFailure({ errorCode: 'WORKER_CRASHED', message: String(err), retryable: true }));
        }
      });
    });
  }
  onDownload(): void {
    this.store.dispatch(BatchConverterActions.downloadOutput());
  }
  ngOnDestroy(): void {
    this.store.dispatch(BatchConverterActions.resetState());
  }
}
