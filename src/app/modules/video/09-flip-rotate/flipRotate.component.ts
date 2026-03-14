import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { FileDropZoneComponent } from '../shared/components/file-drop-zone/file-drop-zone.component';
import { VideoPreviewComponent } from '../shared/components/video-preview/video-preview.component';
import { ProgressRingComponent } from '../shared/components/progress-ring/progress-ring.component';
import { ExportPanelComponent } from '../shared/components/export-panel/export-panel.component';
import { FlipRotateActions, selectFlipRotateState, selectFlipRotateIsLoading, selectFlipRotateCanProcess } from './flipRotate.store';
import { FFmpegService } from '../shared/engine/ffmpeg.service';
import { WorkerBridgeService } from '../shared/engine/worker-bridge.service';

@Component({
  selector: 'app-flip-rotate',
  standalone: true,
  imports: [CommonModule, FileDropZoneComponent, VideoPreviewComponent, ProgressRingComponent, ExportPanelComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-[#0a0a0f] p-6 space-y-6">
      <header class="space-y-1">
        <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-200">
          🔁 Flip & Rotate
        </h1>
        <p class="text-white/50 text-sm">Flip horizontally/vertically and rotate by 90°/180°/270°</p>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <app-file-drop-zone accept="video/*" label="Drop video file here or click to browse" (filesSelected)="onFileSelected($event)" />

          @if ((state$ | async)?.videoMeta; as meta) {
            <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <div class="grid grid-cols-3 gap-3 text-center">
                <div class="p-2 rounded-lg bg-white/5">
                  <p class="text-xs text-white/40">Duration</p>
                  <p class="text-sm font-semibold text-pink-400">{{ meta.duration | number:'1.0-0' }}s</p>
                </div>
                <div class="p-2 rounded-lg bg-white/5">
                  <p class="text-xs text-white/40">Resolution</p>
                  <p class="text-sm font-semibold text-white">{{ meta.width }}×{{ meta.height }}</p>
                </div>
                <div class="p-2 rounded-lg bg-white/5">
                  <p class="text-xs text-white/40">FPS</p>
                  <p class="text-sm font-semibold text-white">{{ meta.fps | number:'1.0-0' }}</p>
                </div>
              </div>

              <!-- Rotation Buttons -->
              <div class="space-y-2">
                <span class="text-xs text-white/40 uppercase tracking-wider" style="display: block;">Rotation</span>
                <div class="grid grid-cols-4 gap-2">
                  @for (r of rotations; track r.deg) {
                    <button (click)="onRotate(r.deg)"
                      class="py-3 rounded-xl text-center transition-all duration-200 border"
                      [class.bg-pink-500]="rotation === r.deg"
                      [class.text-black]="rotation === r.deg"
                      [class.border-pink-500]="rotation === r.deg"
                      [class.bg-white/5]="rotation !== r.deg"
                      [class.text-white/60]="rotation !== r.deg"
                      [class.border-white/10]="rotation !== r.deg">
                      <span class="text-xl block">{{ r.icon }}</span>
                      <span class="text-[10px] block mt-1">{{ r.label }}</span>
                    </button>
                  }
                </div>
              </div>

              <!-- Flip Buttons -->
              <div class="space-y-2">
                <span class="text-xs text-white/40 uppercase tracking-wider" style="display: block;">Flip</span>
                <div class="grid grid-cols-2 gap-2">
                  <button (click)="toggleFlipH()"
                    class="py-3 rounded-xl text-center transition-all duration-200 border"
                    [class.bg-pink-500/20]="flipH"
                    [class.text-pink-300]="flipH"
                    [class.border-pink-500/40]="flipH"
                    [class.bg-white/5]="!flipH"
                    [class.text-white/60]="!flipH"
                    [class.border-white/10]="!flipH">
                    ↔️ Flip Horizontal
                  </button>
                  <button (click)="toggleFlipV()"
                    class="py-3 rounded-xl text-center transition-all duration-200 border"
                    [class.bg-pink-500/20]="flipV"
                    [class.text-pink-300]="flipV"
                    [class.border-pink-500/40]="flipV"
                    [class.bg-white/5]="!flipV"
                    [class.text-white/60]="!flipV"
                    [class.border-white/10]="!flipV">
                    ↕️ Flip Vertical
                  </button>
                </div>
              </div>

              <!-- Active Transforms Summary -->
              <div class="p-3 rounded-xl bg-white/5 text-xs text-white/50">
                Transforms: {{ rotation === 0 ? 'No rotation' : rotation + '°' }}
                {{ flipH ? '• Flip H' : '' }} {{ flipV ? '• Flip V' : '' }}
              </div>

              <button [disabled]="(canProcess$ | async) === false || (isLoading$ | async)" (click)="onProcess()"
                class="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:shadow-[0_0_30px_rgba(236,72,153,0.4)] disabled:opacity-40 disabled:cursor-not-allowed">
                @if (isLoading$ | async) {
                  <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  Transforming...
                } @else { 🔁 Apply Transform }
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
              <app-progress-ring [progress]="(state$ | async)?.progress ?? 0" label="Transforming..." [size]="120" />
            </div>
          }
          @if ((state$ | async)?.status === 'done') {
            <app-export-panel [outputBlob]="(state$ | async)?.outputBlob ?? null" [outputSizeMB]="(state$ | async)?.outputSizeMB ?? null" defaultFilename="omni_flipped" />
          }
        </div>
      </div>
    </div>
  ` })
export class FlipRotateComponent implements OnDestroy {
  private store = inject(Store);
  private ffmpeg = inject(FFmpegService);
  private bridge = inject(WorkerBridgeService);

  state$ = this.store.select(selectFlipRotateState);
  isLoading$ = this.store.select(selectFlipRotateIsLoading);
  canProcess$ = this.store.select(selectFlipRotateCanProcess);

  rotation = 0;
  flipH = false;
  flipV = false;

  rotations = [
    { deg: 0, label: 'None', icon: '⏹️' },
    { deg: 90, label: '90° CW', icon: '↩️' },
    { deg: 180, label: '180°', icon: '🔃' },
    { deg: 270, label: '90° CCW', icon: '↪️' },
  ];

  async onFileSelected(files: File[]) {
    const file = files[0];
    this.store.dispatch(FlipRotateActions.loadFile({ file }));
    try {
      const meta = await this.ffmpeg.getMetadata(file);
      this.store.dispatch(FlipRotateActions.loadMetaSuccess({ meta }));
    } catch {
      this.store.dispatch(FlipRotateActions.loadMetaFailure({ errorCode: 'FILE_CORRUPTED', message: 'Could not read video metadata.' }));
    }
  }

  onRotate(deg: number) {
    this.rotation = deg;
    this.store.dispatch(FlipRotateActions.updateConfig({ config: { rotation: deg } as unknown as BlobPart }));
  }

  toggleFlipH() {
    this.flipH = !this.flipH;
    this.store.dispatch(FlipRotateActions.updateConfig({ config: { flipH: this.flipH } as unknown as BlobPart }));
  }

  toggleFlipV() {
    this.flipV = !this.flipV;
    this.store.dispatch(FlipRotateActions.updateConfig({ config: { flipV: this.flipV } as unknown as BlobPart }));
  }

  onProcess() {
    this.store.dispatch(FlipRotateActions.startProcessing());
    this.state$.subscribe(state => {
      if (!state.inputFile) return;
      this.bridge.process<unknown, Blob>(
        () => new Worker(new URL('./flipRotate.worker', import.meta.url), { type: 'module' }),
        { file: state.inputFile, flipH: this.flipH, flipV: this.flipV, rotation: this.rotation }
      ).subscribe(msg => {
        if (msg.type === 'progress') this.store.dispatch(FlipRotateActions.updateProgress({ progress: msg.value ?? 0 }));
        else if (msg.type === 'complete' && msg.data) {
          const blob = msg.data as Blob;
          this.store.dispatch(FlipRotateActions.processingSuccess({ outputBlob: blob, outputSizeMB: blob.size / 1_048_576 }));
        } else if (msg.type === 'error') {
          this.store.dispatch(FlipRotateActions.processingFailure({ errorCode: msg.errorCode ?? 'UNKNOWN_ERROR', message: msg.message ?? 'Transform failed' }));
        }
      });
    }).unsubscribe();
  }

  ngOnDestroy() { this.store.dispatch(FlipRotateActions.resetState()); }
}
