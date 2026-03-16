import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { FileDropZoneComponent } from '../shared/components/file-drop-zone/file-drop-zone.component';
import { VideoPreviewComponent } from '../shared/components/video-preview/video-preview.component';
import { ProgressRingComponent } from '../shared/components/progress-ring/progress-ring.component';
import { ExportPanelComponent } from '../shared/components/export-panel/export-panel.component';
import { PipActions, selectPipState, selectPipIsLoading, selectPipCanProcess } from './pip.store';
import { FFmpegService } from '../shared/engine/ffmpeg.service';
import { WorkerBridgeService } from '../shared/engine/worker-bridge.service';
import { VideoToolLayoutComponent } from '../shared/components/video-tool-layout/video-tool-layout.component';

@Component({
  selector: 'app-pip',
  standalone: true,
  imports: [CommonModule, FileDropZoneComponent, VideoPreviewComponent, ProgressRingComponent, ExportPanelComponent, VideoToolLayoutComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-video-tool-layout
      title="📺 Picture-in-Picture"
      description="Overlay a smaller video on top of a main video"
      gradientClass="from-sky-400 to-blue-400">
      <div leftPanel class="space-y-4">
        <app-file-drop-zone accept="video/*" label="Drop MAIN video" (filesSelected)="onFileSelected($event)" />
          @if ((state$ | async)?.videoMeta; as meta) {
            <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <div class="grid grid-cols-3 gap-3 text-center">
                <div class="p-2 rounded-lg bg-white/5"><p class="text-xs text-white/40">Duration</p><p class="text-sm font-semibold text-sky-400">{{ meta.duration | number:'1.0-0' }}s</p></div>
                <div class="p-2 rounded-lg bg-white/5"><p class="text-xs text-white/40">Resolution</p><p class="text-sm font-semibold text-white">{{ meta.width }}x{{ meta.height }}</p></div>
                <div class="p-2 rounded-lg bg-white/5"><p class="text-xs text-white/40">Codec</p><p class="text-sm font-semibold text-white">{{ meta.codec }}</p></div>
              </div>
              <!-- Overlay Upload -->
              <span class="flex items-center gap-3 p-4 rounded-xl border-2 border-dashed border-white/20 hover:border-sky-400/50 bg-white/5 cursor-pointer transition-all" style="display: block;">
                <span class="text-2xl">🎬</span>
                <div><p class="text-sm text-white/80">{{ overlayName || 'Select overlay (PiP) video' }}</p><p class="text-xs text-white/40">This will appear in the corner</p></div>
                <input type="file" accept="video/*" (change)="onOverlay($event)" class="hidden" />
              </span>
              <!-- Position -->
              <div class="space-y-2">
                <p class="text-sm text-white/60">PiP Position</p>
                <div class="grid grid-cols-2 gap-2">
                  @for (pos of positions; track pos.value) {
                    <button (click)="pipPosition=pos.value"
                      [class]="pipPosition===pos.value ? 'p-3 rounded-xl border-2 border-sky-400 bg-sky-400/10 text-sky-300 font-semibold text-sm' : 'p-3 rounded-xl border border-white/10 bg-white/5 text-white/60 text-sm hover:bg-white/10'">
                      {{ pos.icon }} {{ pos.label }}
                    </button>
                  }
                </div>
              </div>
              <!-- Size -->
              <div class="space-y-2">
                <div class="flex justify-between text-sm"><span class="text-white/60">PiP Size</span><span class="text-sky-400 font-mono">{{ pipScale }}%</span></div>
                <input type="range" min="10" max="50" [value]="pipScale" (input)="pipScale=+gv($event)" class="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-sky-400" />
              </div>
              <button [disabled]="(canProcess$ | async) === false || (isLoading$ | async) || !overlayFile" (click)="onProcess()"
                class="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-sky-500 to-blue-500 text-white hover:shadow-[0_0_30px_rgba(56,189,248,0.4)] disabled:opacity-40 disabled:cursor-not-allowed">
                @if (isLoading$ | async) { <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div> Processing... } @else { 📺 Create PiP }
              </button>
            </div>
          }
          @if ((state$ | async)?.status === 'error') { <div class="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400">⚠️ {{ (state$ | async)?.errorMessage }}</div> }
      </div>
      <div rightPanel class="space-y-4">
        @if ((state$ | async)?.inputFile) { <app-video-preview [file]="(state$ | async)?.inputFile ?? null" [showControls]="true" /> }
          @if ((state$ | async)?.status === 'processing') { <div class="flex justify-center p-8"><app-progress-ring [progress]="(state$ | async)?.progress ?? 0" label="Creating PiP..." [size]="120" /></div> }
          @if ((state$ | async)?.status === 'done') { <app-export-panel [outputBlob]="(state$ | async)?.outputBlob ?? null" [outputSizeMB]="(state$ | async)?.outputSizeMB ?? null" defaultFilename="omni_pip" /> }
      </div>
    </app-video-tool-layout>
  ` })
export class PipComponent implements OnDestroy {
  private store = inject(Store); private ffmpeg = inject(FFmpegService); private bridge = inject(WorkerBridgeService);
  state$ = this.store.select(selectPipState); isLoading$ = this.store.select(selectPipIsLoading); canProcess$ = this.store.select(selectPipCanProcess);
  overlayFile: File | null = null; overlayName = ''; pipPosition = 'BR'; pipScale = 25;
  positions = [
    { value: 'TL', label: 'Top Left', icon: '↖️' }, { value: 'TR', label: 'Top Right', icon: '↗️' },
    { value: 'BL', label: 'Bottom Left', icon: '↙️' }, { value: 'BR', label: 'Bottom Right', icon: '↘️' },
  ];
  gv(e: Event): string { return (e.target as HTMLInputElement).value; }
  async onFileSelected(files: File[]) {
    const file = files[0]; this.store.dispatch(PipActions.loadFile({ file }));
    try { const meta = await this.ffmpeg.getMetadata(file); this.store.dispatch(PipActions.loadMetaSuccess({ meta })); }
    catch { this.store.dispatch(PipActions.loadMetaFailure({ errorCode: 'FILE_CORRUPTED', message: 'Could not read.' })); }
  }
  onOverlay(e: Event) { const f = (e.target as HTMLInputElement).files?.[0]; if (f) { this.overlayFile = f; this.overlayName = f.name; } }
  onProcess() {
    this.store.dispatch(PipActions.startProcessing());
    this.state$.subscribe(state => {
      if (!state.inputFile || !this.overlayFile) return;
      this.bridge.process<unknown, Blob>(
        () => new Worker(new URL('./pip.worker', import.meta.url), { type: 'module' }),
        { file: state.inputFile, overlayFile: this.overlayFile, position: this.pipPosition, scale: this.pipScale }
      ).subscribe(msg => {
        if (msg.type === 'progress') this.store.dispatch(PipActions.updateProgress({ progress: msg.value ?? 0 }));
        else if (msg.type === 'complete' && msg.data) { const b = msg.data as Blob; this.store.dispatch(PipActions.processingSuccess({ outputBlob: b, outputSizeMB: b.size / 1_048_576 })); }
        else if (msg.type === 'error') { this.store.dispatch(PipActions.processingFailure({ errorCode: msg.errorCode ?? 'UNKNOWN_ERROR', message: msg.message ?? 'PiP failed' })); }
      });
    }).unsubscribe();
  }
  ngOnDestroy() { this.store.dispatch(PipActions.resetState()); }
}
