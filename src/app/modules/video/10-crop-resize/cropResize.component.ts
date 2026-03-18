import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { FileDropZoneComponent } from '../shared/components/file-drop-zone/file-drop-zone.component';
import { VideoPreviewComponent } from '../shared/components/video-preview/video-preview.component';
import { ProgressRingComponent } from '../shared/components/progress-ring/progress-ring.component';
import { ExportPanelComponent } from '../shared/components/export-panel/export-panel.component';
import { CropResizeActions, selectCropResizeState, selectCropResizeIsLoading, selectCropResizeCanProcess, CropResizeState } from './cropResize.store';
import { FFmpegService } from '../shared/engine/ffmpeg.service';
import { WorkerBridgeService } from '../shared/engine/worker-bridge.service';

@Component({
  selector: 'app-crop-resize',
  standalone: true,
  imports: [CommonModule, FileDropZoneComponent, VideoPreviewComponent, ProgressRingComponent, ExportPanelComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-[#0a0a0f] p-6 space-y-6">
      <header class="space-y-1">
        <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-200">
          📐 Crop & Resize
        </h1>
        <p class="text-white/50 text-sm">Resize to preset resolutions or custom dimensions with smart padding</p>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <app-file-drop-zone accept="video/*" label="Drop video file here or click to browse" (filesSelected)="onFileSelected($event)" />

          @if ((state$ | async)?.videoMeta; as meta) {
            <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <div class="grid grid-cols-3 gap-3 text-center">
                <div class="p-2 rounded-lg bg-white/5">
                  <p class="text-xs text-white/40">Current</p>
                  <p class="text-sm font-semibold text-teal-400">{{ meta.width }}×{{ meta.height }}</p>
                </div>
                <div class="p-2 rounded-lg bg-white/5">
                  <p class="text-xs text-white/40">Target</p>
                  <p class="text-sm font-semibold text-emerald-400">{{ targetWidth }}×{{ targetHeight }}</p>
                </div>
                <div class="p-2 rounded-lg bg-white/5">
                  <p class="text-xs text-white/40">Duration</p>
                  <p class="text-sm font-semibold text-white">{{ meta.duration | number:'1.0-0' }}s</p>
                </div>
              </div>

              <!-- Resolution Presets -->
              <div class="space-y-2">
                <span class="text-xs text-white/40 uppercase tracking-wider" style="display: block;">Resolution Preset</span>
                <div class="grid grid-cols-4 gap-2">
                  @for (res of resPresets; track res.label) {
                    <button (click)="onResPreset(res.w, res.h)"
                      class="py-2.5 rounded-xl text-xs font-bold transition-all duration-200 border"
                      [class.bg-teal-500]="targetWidth === res.w && targetHeight === res.h"
                      [class.text-black]="targetWidth === res.w && targetHeight === res.h"
                      [class.border-teal-500]="targetWidth === res.w && targetHeight === res.h"
                      [class.bg-white/5]="targetWidth !== res.w || targetHeight !== res.h"
                      [class.text-white/60]="targetWidth !== res.w || targetHeight !== res.h"
                      [class.border-white/10]="targetWidth !== res.w || targetHeight !== res.h">{{ res.label }}</button>
                  }
                </div>
              </div>

              <!-- Custom Dimensions -->
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <span class="text-xs text-white/40" style="display: block;">Width</span>
                  <input type="number" min="2" step="2" [value]="targetWidth"
                    (change)="onCustomWidth(+($any($event.target)).value)"
                    class="w-full px-2 py-1.5 mt-1 text-sm bg-white/5 border border-white/15 rounded-lg text-white focus:outline-none focus:border-teal-400" />
                </div>
                <div>
                  <span class="text-xs text-white/40" style="display: block;">Height</span>
                  <input type="number" min="2" step="2" [value]="targetHeight"
                    (change)="onCustomHeight(+($any($event.target)).value)"
                    class="w-full px-2 py-1.5 mt-1 text-sm bg-white/5 border border-white/15 rounded-lg text-white focus:outline-none focus:border-teal-400" />
                </div>
              </div>

              <!-- Pad Mode -->
              <div class="space-y-2">
                <span class="text-xs text-white/40 uppercase tracking-wider" style="display: block;">Fit Mode</span>
                <div class="grid grid-cols-3 gap-2">
                  @for (m of padModes; track m.value) {
                    <button (click)="onPadMode(m.value)"
                      class="py-2 rounded-lg text-xs font-semibold transition-all duration-200"
                      [class.bg-teal-500/20]="padMode === m.value"
                      [class.text-teal-300]="padMode === m.value"
                      [class.bg-white/5]="padMode !== m.value"
                      [class.text-white/50]="padMode !== m.value">{{ m.icon }} {{ m.label }}</button>
                  }
                </div>
              </div>

              <button [disabled]="(canProcess$ | async) === false || (isLoading$ | async)" (click)="onProcess()"
                class="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-black hover:shadow-[0_0_30px_rgba(20,184,166,0.4)] disabled:opacity-40 disabled:cursor-not-allowed">
                @if (isLoading$ | async) {
                  <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  Resizing...
                } @else { 📐 Resize Video }
              </button>
            </div>
          }

          @if ((state$ | async)?.status === 'error') {
            <div class="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400">⚠️ {{ (state$ | async)?.errorMessage }}</div>
          }
        </div>

        <div class="space-y-4">
          @if ((state$ | async)?.inputFile) {
            <app-video-preview [file]="(state$ | async)?.inputFile ?? null" [showControls]="true" />
          }
          @if ((state$ | async)?.status === 'processing') {
            <div class="flex justify-center p-8">
              <app-progress-ring [progress]="(state$ | async)?.progress ?? 0" label="Resizing..." [size]="120" />
            </div>
          }
          @if ((state$ | async)?.status === 'done') {
            <app-export-panel [outputBlob]="(state$ | async)?.outputBlob ?? null" [outputSizeMB]="(state$ | async)?.outputSizeMB ?? null" defaultFilename="omni_resized" />
          }
        </div>
      </div>
    </div>
  ` })
export class CropResizeComponent implements OnDestroy {
  private store = inject(Store);
  private ffmpeg = inject(FFmpegService);
  private bridge = inject(WorkerBridgeService);

  state$ = this.store.select(selectCropResizeState);
  isLoading$ = this.store.select(selectCropResizeIsLoading);
  canProcess$ = this.store.select(selectCropResizeCanProcess);

  targetWidth = 1920;
  targetHeight = 1080;
  padMode = 'pad';

  resPresets = [
    { label: '4K', w: 3840, h: 2160 },
    { label: '1080p', w: 1920, h: 1080 },
    { label: '720p', w: 1280, h: 720 },
    { label: '480p', w: 854, h: 480 },
  ];

  padModes = [
    { value: 'pad', label: 'Letterbox', icon: '⬛' },
    { value: 'crop-to-fit', label: 'Crop Fill', icon: '✂️' },
    { value: 'stretch', label: 'Stretch', icon: '↔️' },
  ];

  async onFileSelected(files: File[]) {
    const file = files[0];
    this.store.dispatch(CropResizeActions.loadFile({ file }));
    try {
      const meta = await this.ffmpeg.getMetadata(file);
      this.store.dispatch(CropResizeActions.loadMetaSuccess({ meta }));
    } catch {
      this.store.dispatch(CropResizeActions.loadMetaFailure({ errorCode: 'FILE_CORRUPTED', message: 'Could not read video metadata.' }));
    }
  }

  onResPreset(w: number, h: number) { this.targetWidth = w; this.targetHeight = h; this.syncConfig(); }
  onCustomWidth(w: number) { this.targetWidth = w % 2 === 0 ? w : w - 1; this.syncConfig(); }
  onCustomHeight(h: number) { this.targetHeight = h % 2 === 0 ? h : h - 1; this.syncConfig(); }
  onPadMode(mode: string) { this.padMode = mode; this.syncConfig(); }

  private syncConfig() {
    this.store.dispatch(CropResizeActions.updateConfig({ config: { targetWidth: this.targetWidth, targetHeight: this.targetHeight, padMode: this.padMode as CropResizeState['padMode'] } }));
  }

  onProcess() {
    this.store.dispatch(CropResizeActions.startProcessing());
    this.state$.subscribe(state => {
      if (!state.inputFile) return;
      this.bridge.process<unknown, Blob>(
        () => new Worker(new URL('./cropResize.worker', import.meta.url), { type: 'module' }),
        { file: state.inputFile, mode: 'resize', targetWidth: this.targetWidth, targetHeight: this.targetHeight, padMode: this.padMode }
      ).subscribe(msg => {
        if (msg.type === 'progress') this.store.dispatch(CropResizeActions.updateProgress({ progress: msg.value ?? 0 }));
        else if (msg.type === 'complete' && msg.data) {
          const blob = msg.data as Blob;
          this.store.dispatch(CropResizeActions.processingSuccess({ outputBlob: blob, outputSizeMB: blob.size / 1_048_576 }));
        } else if (msg.type === 'error') {
          this.store.dispatch(CropResizeActions.processingFailure({ errorCode: msg.errorCode ?? 'UNKNOWN_ERROR', message: msg.message ?? 'Resize failed' }));
        }
      });
    });
  }

  ngOnDestroy() { this.store.dispatch(CropResizeActions.resetState()); }
}
