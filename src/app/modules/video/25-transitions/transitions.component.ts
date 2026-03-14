import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { FileDropZoneComponent } from '../shared/components/file-drop-zone/file-drop-zone.component';
import { VideoPreviewComponent } from '../shared/components/video-preview/video-preview.component';
import { ProgressRingComponent } from '../shared/components/progress-ring/progress-ring.component';
import { ExportPanelComponent } from '../shared/components/export-panel/export-panel.component';
import { TransitionsActions, selectTransitionsState, selectTransitionsIsLoading, selectTransitionsCanProcess } from './transitions.store';
import { FFmpegService } from '../shared/engine/ffmpeg.service';
import { WorkerBridgeService } from '../shared/engine/worker-bridge.service';

@Component({
  selector: 'app-transitions',
  standalone: true,
  imports: [CommonModule, FileDropZoneComponent, VideoPreviewComponent, ProgressRingComponent, ExportPanelComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-[#0a0a0f] p-6 space-y-6">
      <header class="space-y-1">
        <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-pink-400">✨ Video Transitions</h1>
        <p class="text-white/50 text-sm">Apply fade, wipe, dissolve, or zoom transitions between clips</p>
      </header>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <app-file-drop-zone accept="video/*" label="Drop video file" (filesSelected)="onFileSelected($event)" />
          @if ((state$ | async)?.videoMeta; as meta) {
            <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <div class="grid grid-cols-3 gap-3 text-center">
                <div class="p-2 rounded-lg bg-white/5"><p class="text-xs text-white/40">Duration</p><p class="text-sm font-semibold text-fuchsia-400">{{ meta.duration | number:'1.0-0' }}s</p></div>
                <div class="p-2 rounded-lg bg-white/5"><p class="text-xs text-white/40">Resolution</p><p class="text-sm font-semibold text-white">{{ meta.width }}x{{ meta.height }}</p></div>
                <div class="p-2 rounded-lg bg-white/5"><p class="text-xs text-white/40">Codec</p><p class="text-sm font-semibold text-white">{{ meta.codec }}</p></div>
              </div>
              <!-- Transition Type -->
              <div class="space-y-2">
                <p class="text-sm text-white/60">Transition Effect</p>
                <div class="grid grid-cols-2 gap-2">
                  @for (t of transitionTypes; track t.value) {
                    <button (click)="transition=t.value"
                      [class]="transition===t.value ? 'p-3 rounded-xl border-2 border-fuchsia-400 bg-fuchsia-400/10 text-fuchsia-300 text-sm font-semibold' : 'p-3 rounded-xl border border-white/10 bg-white/5 text-white/60 text-sm hover:bg-white/10'">
                      {{ t.icon }} {{ t.label }}
                    </button>
                  }
                </div>
              </div>
              <!-- Duration -->
              <div class="space-y-2">
                <div class="flex justify-between text-sm"><span class="text-white/60">Transition Duration</span><span class="text-fuchsia-400 font-mono">{{ transitionDuration }}s</span></div>
                <input type="range" min="0.5" max="5" step="0.5" [value]="transitionDuration" (input)="transitionDuration=+gv($event)" class="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-fuchsia-400" />
                <div class="flex justify-between text-xs text-white/30"><span>0.5s</span><span>2.5s</span><span>5s</span></div>
              </div>
              <button [disabled]="(canProcess$ | async) === false || (isLoading$ | async)" (click)="onProcess()"
                class="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white hover:shadow-[0_0_30px_rgba(217,70,239,0.4)] disabled:opacity-40 disabled:cursor-not-allowed">
                @if (isLoading$ | async) { <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div> Applying... } @else { ✨ Apply Transition }
              </button>
            </div>
          }
          @if ((state$ | async)?.status === 'error') { <div class="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400">⚠️ {{ (state$ | async)?.errorMessage }}</div> }
        </div>
        <div class="space-y-4">
          @if ((state$ | async)?.inputFile) { <app-video-preview [file]="(state$ | async)?.inputFile ?? null" [showControls]="true" /> }
          @if ((state$ | async)?.status === 'processing') { <div class="flex justify-center p-8"><app-progress-ring [progress]="(state$ | async)?.progress ?? 0" label="Applying..." [size]="120" /></div> }
          @if ((state$ | async)?.status === 'done') { <app-export-panel [outputBlob]="(state$ | async)?.outputBlob ?? null" [outputSizeMB]="(state$ | async)?.outputSizeMB ?? null" defaultFilename="omni_transition" /> }
        </div>
      </div>
    </div>
  ` })
export class TransitionsComponent implements OnDestroy {
  private store = inject(Store); private ffmpeg = inject(FFmpegService); private bridge = inject(WorkerBridgeService);
  state$ = this.store.select(selectTransitionsState); isLoading$ = this.store.select(selectTransitionsIsLoading); canProcess$ = this.store.select(selectTransitionsCanProcess);
  transition = 'fade'; transitionDuration = 1;
  transitionTypes = [
    { value: 'fade', label: 'Fade', icon: '🌅' }, { value: 'wipeleft', label: 'Wipe Left', icon: '👈' },
    { value: 'wiperight', label: 'Wipe Right', icon: '👉' }, { value: 'dissolve', label: 'Dissolve', icon: '💫' },
  ];
  gv(e: Event): string { return (e.target as HTMLInputElement).value; }
  async onFileSelected(files: File[]) {
    const file = files[0]; this.store.dispatch(TransitionsActions.loadFile({ file }));
    try { const meta = await this.ffmpeg.getMetadata(file); this.store.dispatch(TransitionsActions.loadMetaSuccess({ meta })); }
    catch { this.store.dispatch(TransitionsActions.loadMetaFailure({ errorCode: 'FILE_CORRUPTED', message: 'Could not read.' })); }
  }
  onProcess() {
    this.store.dispatch(TransitionsActions.startProcessing());
    this.state$.subscribe(state => {
      if (!state.inputFile) return;
      this.bridge.process<unknown, Blob>(
        () => new Worker(new URL('./transitions.worker', import.meta.url), { type: 'module' }),
        { file: state.inputFile, transition: this.transition, duration: this.transitionDuration }
      ).subscribe(msg => {
        if (msg.type === 'progress') this.store.dispatch(TransitionsActions.updateProgress({ progress: msg.value ?? 0 }));
        else if (msg.type === 'complete' && msg.data) { const b = msg.data as Blob; this.store.dispatch(TransitionsActions.processingSuccess({ outputBlob: b, outputSizeMB: b.size / 1_048_576 })); }
        else if (msg.type === 'error') { this.store.dispatch(TransitionsActions.processingFailure({ errorCode: msg.errorCode ?? 'UNKNOWN_ERROR', message: msg.message ?? 'Transition failed' })); }
      });
    }).unsubscribe();
  }
  ngOnDestroy() { this.store.dispatch(TransitionsActions.resetState()); }
}
