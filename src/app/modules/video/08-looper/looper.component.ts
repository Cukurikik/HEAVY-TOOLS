import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { FileDropZoneComponent } from '../shared/components/file-drop-zone/file-drop-zone.component';
import { VideoPreviewComponent } from '../shared/components/video-preview/video-preview.component';
import { ProgressRingComponent } from '../shared/components/progress-ring/progress-ring.component';
import { ExportPanelComponent } from '../shared/components/export-panel/export-panel.component';
import { LooperActions, selectLooperState, selectLooperIsLoading, selectLooperCanProcess } from './looper.store';
import { FFmpegService } from '../shared/engine/ffmpeg.service';
import { WorkerBridgeService } from '../shared/engine/worker-bridge.service';

@Component({
  selector: 'app-looper',
  standalone: true,
  imports: [CommonModule, FileDropZoneComponent, VideoPreviewComponent, ProgressRingComponent, ExportPanelComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-[#0a0a0f] p-6 space-y-6">
      <header class="space-y-1">
        <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
          🔁 Video Looper
        </h1>
        <p class="text-white/50 text-sm">Create seamless video loops by repeating content N times</p>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <app-file-drop-zone accept="video/*" label="Drop video to loop" (filesSelected)="onFileSelected($event)" />

          @if ((state$ | async)?.videoMeta; as meta) {
            <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <div class="grid grid-cols-3 gap-3 text-center">
                <div class="p-2 rounded-lg bg-white/5">
                  <p class="text-xs text-white/40">Duration</p>
                  <p class="text-sm font-semibold text-green-400">{{ meta.duration | number:'1.0-0' }}s</p>
                </div>
                <div class="p-2 rounded-lg bg-white/5">
                  <p class="text-xs text-white/40">Resolution</p>
                  <p class="text-sm font-semibold text-white">{{ meta.width }}x{{ meta.height }}</p>
                </div>
                <div class="p-2 rounded-lg bg-white/5">
                  <p class="text-xs text-white/40">Output Duration</p>
                  <p class="text-sm font-semibold text-green-400">{{ meta.duration * loopCount | number:'1.0-0' }}s</p>
                </div>
              </div>

              <!-- Loop Count -->
              <div class="space-y-2">
                <div class="flex justify-between text-sm">
                  <span class="text-white/60">Number of Loops</span>
                  <span class="text-green-400 font-mono text-lg font-bold">{{ loopCount }}x</span>
                </div>
                <input type="range" min="2" max="20" [value]="loopCount"
                  (input)="onLoopCount($event)"
                  class="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-green-400" />
                <div class="flex justify-between text-xs text-white/30">
                  <span>2x</span><span>10x</span><span>20x</span>
                </div>
              </div>

              <!-- Quick Count Buttons -->
              <div class="grid grid-cols-5 gap-2">
                @for (count of quickCounts; track count) {
                  <button (click)="loopCount = count"
                    [class]="loopCount === count
                      ? 'py-2 rounded-lg border-2 border-green-400 bg-green-400/10 text-green-400 text-sm font-bold'
                      : 'py-2 rounded-lg border border-white/10 bg-white/5 text-white/60 text-sm hover:bg-white/10'">
                    {{ count }}x
                  </button>
                }
              </div>

              <!-- Transition Mode -->
              <div class="space-y-2">
                <p class="text-sm text-white/60">Loop Transition</p>
                <div class="grid grid-cols-2 gap-2">
                  @for (mode of transitionModes; track mode.value) {
                    <button (click)="selectedTransition = mode.value"
                      [class]="selectedTransition === mode.value
                        ? 'p-3 rounded-xl border-2 border-green-400 bg-green-400/10 text-green-300 text-sm font-semibold transition-all'
                        : 'p-3 rounded-xl border border-white/10 bg-white/5 text-white/60 text-sm hover:bg-white/10 transition-all'">
                      {{ mode.icon }} {{ mode.label }}
                    </button>
                  }
                </div>
              </div>

              <button [disabled]="(canProcess$ | async) === false || (isLoading$ | async)" (click)="onProcess()"
                class="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-black hover:shadow-[0_0_30px_rgba(34,197,94,0.4)] disabled:opacity-40 disabled:cursor-not-allowed">
                @if (isLoading$ | async) {
                  <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  Looping...
                } @else { 🔁 Create Loop }
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
          @if ((state$ | async)?.inputFile) {
            <app-video-preview [file]="(state$ | async)?.inputFile ?? null" [showControls]="true" />
          }
          @if ((state$ | async)?.status === 'processing') {
            <div class="flex justify-center p-8">
              <app-progress-ring [progress]="(state$ | async)?.progress ?? 0" label="Creating Loop..." [size]="120" />
            </div>
          }
          @if ((state$ | async)?.status === 'done') {
            <app-export-panel [outputBlob]="(state$ | async)?.outputBlob ?? null"
              [outputSizeMB]="(state$ | async)?.outputSizeMB ?? null" defaultFilename="omni_looped" />
          }
        </div>
      </div>
    </div>
  ` })
export class LooperComponent implements OnDestroy {
  private store = inject(Store);
  private ffmpeg = inject(FFmpegService);
  private bridge = inject(WorkerBridgeService);

  state$ = this.store.select(selectLooperState);
  isLoading$ = this.store.select(selectLooperIsLoading);
  canProcess$ = this.store.select(selectLooperCanProcess);

  /** Local UI config — avoids Angular Language Service type inference issues */
  loopCount = 3;
  selectedTransition = 'cut';

  quickCounts = [2, 3, 5, 10, 15];
  transitionModes = [
    { value: 'cut' as const, label: 'Hard Cut', icon: '✂️' },
    { value: 'crossfade' as const, label: 'Crossfade', icon: '🌊' },
  ];

  async onFileSelected(files: File[]) {
    const file = files[0];
    this.store.dispatch(LooperActions.loadFile({ file }));
    try {
      const meta = await this.ffmpeg.getMetadata(file);
      this.store.dispatch(LooperActions.loadMetaSuccess({ meta }));
    } catch {
      this.store.dispatch(LooperActions.loadMetaFailure({ errorCode: 'FILE_CORRUPTED', message: 'Could not read video metadata.' }));
    }
  }

  onLoopCount(e: Event) { this.loopCount = +(e.target as HTMLInputElement).value; }

  onProcess() {
    this.store.dispatch(LooperActions.startProcessing());
    this.state$.subscribe(state => {
      if (!state.inputFile) return;
      this.bridge.process<unknown, Blob>(
        () => new Worker(new URL('./looper.worker', import.meta.url), { type: 'module' }),
        { file: state.inputFile, loopCount: this.loopCount, transitionMode: this.selectedTransition }
      ).subscribe(msg => {
        if (msg.type === 'progress') this.store.dispatch(LooperActions.updateProgress({ progress: msg.value ?? 0 }));
        else if (msg.type === 'complete' && msg.data) {
          const blob = msg.data as Blob;
          this.store.dispatch(LooperActions.processingSuccess({ outputBlob: blob, outputSizeMB: blob.size / 1_048_576 }));
        } else if (msg.type === 'error') {
          this.store.dispatch(LooperActions.processingFailure({ errorCode: msg.errorCode ?? 'UNKNOWN_ERROR', message: msg.message ?? 'Loop creation failed' }));
        }
      });
    }).unsubscribe();
  }

  ngOnDestroy() { this.store.dispatch(LooperActions.resetState()); }
}
