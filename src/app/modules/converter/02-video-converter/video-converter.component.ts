// ============================================================
// FEATURE 02 — VIDEO CONVERTER — Component
// Route: /converter/video-converter
// ============================================================
import { ChangeDetectionStrategy, Component, inject, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { FileDropZoneComponent } from '../shared/components/file-drop-zone/file-drop-zone.component';
import { ConverterFormatSelectorComponent, FormatOption } from '../shared/components/format-selector/format-selector.component';
import { ConverterProgressRingComponent } from '../shared/components/progress-ring/progress-ring.component';
import { ConverterExportPanelComponent } from '../shared/components/export-panel/export-panel.component';
import { VideoConverterActions, selectVideoConverterState } from './video-converter.store';
import { ConverterWorkerBridgeService } from '../shared/engine/worker-bridge.service';
import { take } from 'rxjs';

const OUTPUT_FORMATS: FormatOption[] = [
  { value: 'mp4', label: 'MP4', icon: '🎬', badge: 'Standard' },
  { value: 'webm', label: 'WEBM', icon: '🌐', badge: 'Best Size' },
  { value: 'avi', label: 'AVI', icon: '📼' },
  { value: 'mov', label: 'MOV', icon: '🍎' },
  { value: 'mkv', label: 'MKV', icon: '📦' },
  { value: 'gif', label: 'GIF', icon: '🎞️' },
];

@Component({
  selector: 'app-video-converter',
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
          🎬 Video Converter
        </h1>
        <p class="text-white/50 text-sm">Convert videos between MP4, WEBM, AVI, MOV, MKV, and GIF</p>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <app-file-drop-zone 
            accept="video/*" 
            label="Drop video files here or click to browse" 
            icon="🎬"
            [supportedFormats]="['mp4', 'webm', 'avi', 'mov', 'mkv']"
            (filesSelected)="onFilesSelected($event)" />

          <app-converter-format-selector
            [formats]="outputFormats"
            [selected]="((state$ | async)?.outputFormat ?? 'mp4')"
            (formatChange)="onFormatChange($event)" />

          <button
            [disabled]="(state$ | async)?.status === 'processing' || !(state$ | async)?.inputFile"
            (click)="onProcess()"
            class="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2
                   bg-gradient-to-r from-cyan-500 to-blue-500 text-black disabled:opacity-40 disabled:cursor-not-allowed">
            @if ((state$ | async)?.status === 'processing') {
              <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              Processing...
            } @else { 🎬 Convert }
          </button>

          @if ((state$ | async)?.status === 'error') {
            <div class="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400">
              ⚠️ {{ (state$ | async)?.errorMessage }}
            </div>
          }
        </div>

        <div class="space-y-4">
          @if (previewUrl()) {
            <div class="bg-[#12121a] rounded-2xl p-6 border border-white/5">
              <video [src]="previewUrl()" controls class="w-full rounded-xl bg-black/40 aspect-video mb-4"></video>
          
              @if ((state$ | async)?.status === 'processing') {
                <div class="mt-4 flex flex-col items-center gap-3 text-center">
                  <app-converter-progress-ring [progress]="(state$ | async)?.progress ?? 0"></app-converter-progress-ring>
                  <span class="text-white/70">Converting... {{ ((state$ | async)?.progress ?? 0) | number:'1.0-0' }}%</span>
                </div>
              }
          
              @if ((state$ | async)?.status === 'done') {
                <app-converter-export-panel 
                  [outputBlob]="((state$ | async)?.outputBlob ?? null)"
                  [outputSizeMB]="(state$ | async)?.outputSizeMB ?? null"
                  [filename]="'converted.' + (state$ | async)?.outputFormat"
                  (download)="onDownload()" />
              }
            </div>
          }
        </div>
      </div>
    </div>
  ` })
export class VideoConverterComponent implements OnDestroy {
  private store = inject(Store);
  private bridge = inject(ConverterWorkerBridgeService);
  
  state$ = this.store.select(selectVideoConverterState);
  outputFormats = OUTPUT_FORMATS;
  previewUrl = signal<string | null>(null);

  onFilesSelected(files: File[]) {
    const file = files[0];
    if (file) {
      this.store.dispatch(VideoConverterActions.loadFile({ file }));
      if (this.previewUrl()) URL.revokeObjectURL(this.previewUrl()!);
      this.previewUrl.set(URL.createObjectURL(file));
    }
  }

  onFormatChange(format: string) {
    this.store.dispatch(VideoConverterActions.setOutputFormat({ format }));
  }

  onProcess() {
    this.state$.pipe(take(1)).subscribe(state => {
      if (!state.inputFile) return;
      
      this.store.dispatch(VideoConverterActions.startProcessing());
      
      this.bridge.process<any, Blob>(
        () => new Worker(new URL('./video-converter.worker', import.meta.url), { type: 'module' }),
        { 
          file: state.inputFile, 
          outputFormat: state.outputFormat,
          crf: state.crf, encodingSpeed: state.encodingSpeed, resolution: state.resolution
        }
      ).subscribe({
        next: (msg) => {
          if (msg.type === 'progress') {
            this.store.dispatch(VideoConverterActions.updateProgress({ progress: msg.value ?? 0 }));
          } else if (msg.type === 'complete' && msg.data) {
            const blob = msg.data as Blob;
            this.store.dispatch(VideoConverterActions.processingSuccess({ 
              outputBlob: blob, 
              outputSizeMB: blob.size / 1048576 
            }));
          } else if (msg.type === 'error') {
            this.store.dispatch(VideoConverterActions.processingFailure({ 
              errorCode: msg.errorCode ?? 'UNKNOWN_ERROR', 
              message: msg.message ?? 'Conversion failed',
              retryable: true
            }));
          }
        },
        error: (err) => {
          this.store.dispatch(VideoConverterActions.processingFailure({ 
            errorCode: 'WORKER_CRASHED', 
            message: String(err),
            retryable: true
          }));
        }
      });
    });
  }

  onDownload() {
    this.store.dispatch(VideoConverterActions.downloadOutput());
  }

  ngOnDestroy() {
    if (this.previewUrl()) URL.revokeObjectURL(this.previewUrl()!);
    this.store.dispatch(VideoConverterActions.resetState());
  }
}