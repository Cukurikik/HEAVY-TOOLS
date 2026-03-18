// ============================================================
// FEATURE 01 — IMAGE CONVERTER — Component
// Route: /converter/image-converter
// ============================================================
import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { FileDropZoneComponent } from '../shared/components/file-drop-zone/file-drop-zone.component';
import { ConverterFormatSelectorComponent, FormatOption } from '../shared/components/format-selector/format-selector.component';
import { ConverterProgressRingComponent } from '../shared/components/progress-ring/progress-ring.component';
import { ConverterExportPanelComponent } from '../shared/components/export-panel/export-panel.component';
import { ImageConverterActions, selectImageConverterState } from './image-converter.store';
import { ConverterWorkerBridgeService } from '../shared/engine/worker-bridge.service';
import { take } from 'rxjs';

const OUTPUT_FORMATS: FormatOption[] = [
  { value: 'jpeg', label: 'JPEG', icon: '🖼️' },
  { value: 'png',  label: 'PNG',  icon: '🎨' },
  { value: 'webp', label: 'WEBP', icon: '🌐' },
  { value: 'avif', label: 'AVIF', icon: '🚀', badge: 'Best' },
  { value: 'bmp',  label: 'BMP',  icon: '📋' },
  { value: 'tiff', label: 'TIFF', icon: '📐' },
  { value: 'gif',  label: 'GIF',  icon: '🎞️' },
];

@Component({
  selector: 'app-image-converter',
  standalone: true,
  imports: [
    CommonModule,
    FileDropZoneComponent,
    ConverterFormatSelectorComponent,
    ConverterProgressRingComponent,
    ConverterExportPanelComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-[#0a0a0f] p-6 space-y-6">
      <header class="space-y-1">
        <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
          🖼️ Image Format Converter
        </h1>
        <p class="text-white/50 text-sm">Convert images between JPEG, PNG, WEBP, AVIF, BMP, TIFF, GIF formats</p>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <app-file-drop-zone
            accept="image/*"
            [multiple]="false"
            [maxSizeMB]="50"
            label="Drop images here or click to browse"
            (filesSelected)="onFilesSelected($event)" />

          <app-converter-format-selector
            [formats]="outputFormats"
            [selected]="(state$ | async)?.outputFormat ?? 'jpeg'"
            (formatChange)="onFormatChange($event)" />

          @if ((state$ | async)?.inputFiles?.length) {
            <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <div class="space-y-2">
                <span class="text-xs text-white/40" style="display: block;">Quality: {{ (state$ | async)?.quality }}%</span>
                <input type="range" min="1" max="100" [value]="(state$ | async)?.quality ?? 85"
                  (input)="onQualityChange(+($any($event.target)).value)"
                  class="w-full accent-cyan-400" />
              </div>

              <div class="flex gap-2">
                <span class="flex items-center gap-2 text-sm text-white/60 cursor-pointer" style="display: block;">
                  <input type="checkbox" [checked]="(state$ | async)?.preserveExif"
                    (change)="store.dispatch(actions.togglePreserveExif())"
                    class="accent-cyan-400" />
                  Preserve EXIF
                </span>
              </div>

              <button
                [disabled]="(state$ | async)?.status === 'processing'"
                (click)="onProcess()"
                class="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2
                       bg-gradient-to-r from-cyan-500 to-blue-500 text-black disabled:opacity-40 disabled:cursor-not-allowed">
                @if ((state$ | async)?.status === 'processing') {
                  <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  Converting...
                } @else { 🔄 Convert Images }
              </button>
            </div>
          }

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
          @if ((state$ | async)?.status === 'done') {
            <app-converter-export-panel
              [outputBlob]="(state$ | async)?.outputBlob ?? null"
              [outputSizeMB]="(state$ | async)?.outputSizeMB ?? null"
              [filename]="'converted.' + (state$ | async)?.outputFormat"
              (download)="onDownload()" />
          }
        </div>
      </div>
    </div>
  ` })
export class ImageConverterComponent implements OnDestroy {
  store = inject(Store);
  private bridge = inject(ConverterWorkerBridgeService);
  
  state$ = this.store.select(selectImageConverterState);
  outputFormats = OUTPUT_FORMATS;
  actions = ImageConverterActions;

  onFilesSelected(files: File[]): void {
    this.store.dispatch(ImageConverterActions.loadFiles({ files }));
  }
  onFormatChange(format: string): void {
    this.store.dispatch(ImageConverterActions.setOutputFormat({ format }));
  }
  onQualityChange(quality: number): void {
    this.store.dispatch(ImageConverterActions.setQuality({ quality }));
  }
  
  onProcess(): void {
    this.state$.pipe(take(1)).subscribe(state => {
      if (!state.inputFiles.length) return;
      
      this.store.dispatch(ImageConverterActions.startProcessing());
      
      this.bridge.process<any, Blob>(
        () => new Worker(new URL('./image-converter.worker', import.meta.url), { type: 'module' }),
        { 
          file: state.inputFiles[0], 
          outputFormat: state.outputFormat, 
          quality: state.quality,
          colorSpace: state.colorSpace,
          preserveExif: state.preserveExif,
          lossless: state.lossless
        }
      ).subscribe({
        next: (msg) => {
          if (msg.type === 'progress') {
            this.store.dispatch(ImageConverterActions.updateProgress({ progress: msg.value ?? 0 }));
          } else if (msg.type === 'complete' && msg.data) {
            const blob = msg.data as Blob;
            this.store.dispatch(ImageConverterActions.processingSuccess({ 
              outputBlob: blob, 
              outputSizeMB: blob.size / 1048576 
            }));
          } else if (msg.type === 'error') {
            this.store.dispatch(ImageConverterActions.processingFailure({ 
              errorCode: msg.errorCode ?? 'UNKNOWN_ERROR', 
              message: msg.message ?? 'Conversion failed',
              retryable: true
            }));
          }
        },
        error: (err) => {
          this.store.dispatch(ImageConverterActions.processingFailure({ 
            errorCode: 'WORKER_CRASHED', 
            message: String(err),
            retryable: true
          }));
        }
      });
    });
  }

  onDownload(): void {
    this.store.dispatch(ImageConverterActions.downloadOutput());
  }

  ngOnDestroy(): void {
    this.store.dispatch(ImageConverterActions.resetState());
  }
}