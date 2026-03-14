import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { FileDropZoneComponent } from '../shared/components/file-drop-zone/file-drop-zone.component';
import { VideoPreviewComponent } from '../shared/components/video-preview/video-preview.component';
import { ProgressRingComponent } from '../shared/components/progress-ring/progress-ring.component';
import { ExportPanelComponent } from '../shared/components/export-panel/export-panel.component';
import { SubtitleBurnerActions, selectSubtitleBurnerState, selectSubtitleBurnerIsLoading, selectSubtitleBurnerCanProcess } from './subtitleBurner.store';
import { FFmpegService } from '../shared/engine/ffmpeg.service';
import { WorkerBridgeService } from '../shared/engine/worker-bridge.service';

@Component({
  selector: 'app-subtitle-burner',
  standalone: true,
  imports: [CommonModule, FileDropZoneComponent, VideoPreviewComponent, ProgressRingComponent, ExportPanelComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-[#0a0a0f] p-6 space-y-6">
      <header class="space-y-1">
        <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-400">💬 Subtitle Burner</h1>
        <p class="text-white/50 text-sm">Hardcode SRT/ASS subtitles permanently into the video</p>
      </header>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <app-file-drop-zone accept="video/*" label="Drop video file here" (filesSelected)="onFileSelected($event)" />

          @if ((state$ | async)?.videoMeta; as meta) {
            <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <div class="grid grid-cols-3 gap-3 text-center">
                <div class="p-2 rounded-lg bg-white/5"><p class="text-xs text-white/40">Duration</p><p class="text-sm font-semibold text-yellow-400">{{ meta.duration | number:'1.0-0' }}s</p></div>
                <div class="p-2 rounded-lg bg-white/5"><p class="text-xs text-white/40">Resolution</p><p class="text-sm font-semibold text-white">{{ meta.width }}x{{ meta.height }}</p></div>
                <div class="p-2 rounded-lg bg-white/5"><p class="text-xs text-white/40">Codec</p><p class="text-sm font-semibold text-white">{{ meta.codec }}</p></div>
              </div>

              <!-- SRT Upload -->
              <div class="space-y-2">
                <p class="text-sm text-white/60">Subtitle File (.srt / .ass)</p>
                <label class="flex items-center gap-3 p-4 rounded-xl border-2 border-dashed border-white/20 hover:border-yellow-400/50 bg-white/5 cursor-pointer transition-all">
                  <span class="text-2xl">📄</span>
                  <div>
                    <p class="text-sm text-white/80">{{ subtitleFileName || 'Click to select subtitle file' }}</p>
                    <p class="text-xs text-white/40">Supports .srt, .ass, .ssa</p>
                  </div>
                  <input type="file" accept=".srt,.ass,.ssa,.vtt" (change)="onSubtitleFile($event)" class="hidden" />
                </label>
              </div>

              <!-- Font Size -->
              <div class="space-y-2">
                <div class="flex justify-between text-sm">
                  <span class="text-white/60">Font Size</span>
                  <span class="text-yellow-400 font-mono">{{ fontSize }}px</span>
                </div>
                <input type="range" min="12" max="72" [value]="fontSize" (input)="onFontSize($event)"
                  class="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-yellow-400" />
                <div class="flex justify-between text-xs text-white/30"><span>12px</span><span>42px</span><span>72px</span></div>
              </div>

              <!-- Position -->
              <div class="space-y-2">
                <p class="text-sm text-white/60">Subtitle Position</p>
                <div class="grid grid-cols-3 gap-2">
                  @for (pos of positions; track pos.value) {
                    <button (click)="onPosition(pos.value)"
                      [class]="position === pos.value
                        ? 'p-2 rounded-lg border-2 border-yellow-400 bg-yellow-400/10 text-yellow-300 text-sm font-semibold'
                        : 'p-2 rounded-lg border border-white/10 bg-white/5 text-white/60 text-sm hover:bg-white/10'">
                      {{ pos.icon }} {{ pos.label }}
                    </button>
                  }
                </div>
              </div>

              <!-- Font Color -->
              <div class="space-y-2">
                <p class="text-sm text-white/60">Font Color</p>
                <div class="grid grid-cols-6 gap-2">
                  @for (color of fontColors; track color) {
                    <button (click)="onFontColor(color)" [style.background]="color"
                      [class]="fontColor === color
                        ? 'w-8 h-8 rounded-full ring-2 ring-yellow-400 ring-offset-2 ring-offset-[#0a0a0f]'
                        : 'w-8 h-8 rounded-full border border-white/20 hover:scale-110 transition-transform'">
                    </button>
                  }
                </div>
              </div>

              <button [disabled]="!(canProcess$ | async) || (isLoading$ | async) || !subtitleFile" (click)="onProcess()"
                class="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-500 to-amber-500 text-black hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] disabled:opacity-40 disabled:cursor-not-allowed">
                @if (isLoading$ | async) {
                  <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div> Burning...
                } @else { 💬 Burn Subtitles }
              </button>
            </div>
          }
          @if ((state$ | async)?.status === 'error') {
            <div class="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400">⚠️ {{ (state$ | async)?.errorMessage }}</div>
          }
        </div>
        <div class="space-y-4">
          @if ((state$ | async)?.inputFile) { <app-video-preview [file]="(state$ | async)?.inputFile ?? null" [showControls]="true" /> }
          @if ((state$ | async)?.status === 'processing') { <div class="flex justify-center p-8"><app-progress-ring [progress]="(state$ | async)?.progress ?? 0" label="Burning..." [size]="120" /></div> }
          @if ((state$ | async)?.status === 'done') { <app-export-panel [outputBlob]="(state$ | async)?.outputBlob ?? null" [outputSizeMB]="(state$ | async)?.outputSizeMB ?? null" defaultFilename="omni_subtitled" /> }
        </div>
      </div>
    </div>
  `,
})
export class SubtitleBurnerComponent implements OnDestroy {
  private store = inject(Store);
  private ffmpeg = inject(FFmpegService);
  private bridge = inject(WorkerBridgeService);
  state$ = this.store.select(selectSubtitleBurnerState);
  isLoading$ = this.store.select(selectSubtitleBurnerIsLoading);
  canProcess$ = this.store.select(selectSubtitleBurnerCanProcess);

  subtitleFile: File | null = null;
  subtitleFileName = '';
  fontSize = 24;
  position = 'bottom';
  fontColor = '#ffffff';

  positions = [
    { value: 'top', label: 'Top', icon: '⬆️' },
    { value: 'center', label: 'Center', icon: '⏺️' },
    { value: 'bottom', label: 'Bottom', icon: '⬇️' },
  ];
  fontColors = ['#ffffff', '#ffff00', '#00ff00', '#00ffff', '#ff6600', '#ff0000'];

  async onFileSelected(files: File[]) {
    const file = files[0];
    this.store.dispatch(SubtitleBurnerActions.loadFile({ file }));
    try {
      const meta = await this.ffmpeg.getMetadata(file);
      this.store.dispatch(SubtitleBurnerActions.loadMetaSuccess({ meta }));
    } catch {
      this.store.dispatch(SubtitleBurnerActions.loadMetaFailure({ errorCode: 'FILE_CORRUPTED', message: 'Could not read video metadata.' }));
    }
  }

  onSubtitleFile(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.files?.[0]) { this.subtitleFile = input.files[0]; this.subtitleFileName = input.files[0].name; }
  }
  onFontSize(e: Event) { this.fontSize = +(e.target as HTMLInputElement).value; }
  onPosition(p: string) { this.position = p; }
  onFontColor(c: string) { this.fontColor = c; }

  onProcess() {
    this.store.dispatch(SubtitleBurnerActions.startProcessing());
    this.state$.subscribe(state => {
      if (!state.inputFile || !this.subtitleFile) return;
      this.bridge.process<unknown, Blob>(
        () => new Worker(new URL('./subtitleBurner.worker', import.meta.url), { type: 'module' }),
        { file: state.inputFile, subtitleFile: this.subtitleFile, fontSize: this.fontSize, position: this.position, fontColor: this.fontColor }
      ).subscribe(msg => {
        if (msg.type === 'progress') this.store.dispatch(SubtitleBurnerActions.updateProgress({ progress: msg.value ?? 0 }));
        else if (msg.type === 'complete' && msg.data) {
          const blob = msg.data as Blob;
          this.store.dispatch(SubtitleBurnerActions.processingSuccess({ outputBlob: blob, outputSizeMB: blob.size / 1_048_576 }));
        } else if (msg.type === 'error') {
          this.store.dispatch(SubtitleBurnerActions.processingFailure({ errorCode: msg.errorCode ?? 'UNKNOWN_ERROR', message: msg.message ?? 'Burning failed' }));
        }
      });
    }).unsubscribe();
  }

  ngOnDestroy() { this.store.dispatch(SubtitleBurnerActions.resetState()); }
}
