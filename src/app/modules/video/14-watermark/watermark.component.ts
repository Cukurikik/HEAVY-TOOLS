import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { FileDropZoneComponent } from '../shared/components/file-drop-zone/file-drop-zone.component';
import { VideoPreviewComponent } from '../shared/components/video-preview/video-preview.component';
import { ProgressRingComponent } from '../shared/components/progress-ring/progress-ring.component';
import { ExportPanelComponent } from '../shared/components/export-panel/export-panel.component';
import { WatermarkActions, selectWatermarkState, selectWatermarkIsLoading, selectWatermarkCanProcess } from './watermark.store';
import { FFmpegService } from '../shared/engine/ffmpeg.service';
import { WorkerBridgeService } from '../shared/engine/worker-bridge.service';

@Component({
  selector: 'app-watermark',
  standalone: true,
  imports: [CommonModule, FileDropZoneComponent, VideoPreviewComponent, ProgressRingComponent, ExportPanelComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-[#0a0a0f] p-6 space-y-6">
      <header class="space-y-1">
        <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-300">💧 Watermark Adder</h1>
        <p class="text-white/50 text-sm">Overlay text or image watermark with position and opacity control</p>
      </header>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <app-file-drop-zone accept="video/*" label="Drop video file here" (filesSelected)="onFileSelected($event)" />
          @if ((state$ | async)?.videoMeta; as meta) {
            <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <div class="grid grid-cols-3 gap-3 text-center">
                <div class="p-2 rounded-lg bg-white/5"><p class="text-xs text-white/40">Duration</p><p class="text-sm font-semibold text-teal-400">{{ meta.duration | number:'1.0-0' }}s</p></div>
                <div class="p-2 rounded-lg bg-white/5"><p class="text-xs text-white/40">Resolution</p><p class="text-sm font-semibold text-white">{{ meta.width }}x{{ meta.height }}</p></div>
                <div class="p-2 rounded-lg bg-white/5"><p class="text-xs text-white/40">Codec</p><p class="text-sm font-semibold text-white">{{ meta.codec }}</p></div>
              </div>

              <!-- Watermark Mode -->
              <div class="space-y-2">
                <p class="text-sm text-white/60">Watermark Type</p>
                <div class="grid grid-cols-2 gap-2">
                  <button (click)="wmMode='text'" [class]="wmMode==='text' ? 'p-3 rounded-xl border-2 border-teal-400 bg-teal-400/10 text-teal-300 font-semibold text-sm' : 'p-3 rounded-xl border border-white/10 bg-white/5 text-white/60 text-sm hover:bg-white/10'">✏️ Text</button>
                  <button (click)="wmMode='image'" [class]="wmMode==='image' ? 'p-3 rounded-xl border-2 border-teal-400 bg-teal-400/10 text-teal-300 font-semibold text-sm' : 'p-3 rounded-xl border border-white/10 bg-white/5 text-white/60 text-sm hover:bg-white/10'">🖼️ Image</button>
                </div>
              </div>

              @if (wmMode === 'text') {
                <div class="space-y-2">
                  <p class="text-sm text-white/60">Watermark Text</p>
                  <input type="text" [value]="wmText" (input)="onWmText($event)" placeholder="Enter watermark text..."
                    class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-teal-400 focus:outline-none" />
                </div>
                <div class="space-y-2">
                  <div class="flex justify-between text-sm"><span class="text-white/60">Font Size</span><span class="text-teal-400 font-mono">{{ wmFontSize }}px</span></div>
                  <input type="range" min="12" max="72" [value]="wmFontSize" (input)="wmFontSize=+getValue($event)" class="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-teal-400" />
                </div>
              }
              @if (wmMode === 'image') {
                <span class="flex items-center gap-3 p-4 rounded-xl border-2 border-dashed border-white/20 hover:border-teal-400/50 bg-white/5 cursor-pointer transition-all" style="display: block;">
                  <span class="text-2xl">🖼️</span>
                  <div><p class="text-sm text-white/80">{{ wmImageName || 'Select watermark image' }}</p><p class="text-xs text-white/40">PNG with transparency recommended</p></div>
                  <input type="file" accept="image/*" (change)="onWmImage($event)" class="hidden" />
                </span>
              }

              <!-- Position Grid -->
              <div class="space-y-2">
                <p class="text-sm text-white/60">Position</p>
                <div class="grid grid-cols-3 gap-1 w-48 mx-auto">
                  @for (pos of positionGrid; track pos) {
                    <button (click)="wmPosition=pos" [class]="wmPosition===pos ? 'w-14 h-10 rounded bg-teal-400/30 border-2 border-teal-400 text-xs text-teal-300' : 'w-14 h-10 rounded bg-white/5 border border-white/10 text-xs text-white/40 hover:bg-white/10'">{{ pos }}</button>
                  }
                </div>
              </div>

              <!-- Opacity -->
              <div class="space-y-2">
                <div class="flex justify-between text-sm"><span class="text-white/60">Opacity</span><span class="text-teal-400 font-mono">{{ wmOpacity }}%</span></div>
                <input type="range" min="10" max="100" [value]="wmOpacity" (input)="wmOpacity=+getValue($event)" class="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-teal-400" />
              </div>

              <button [disabled]="(canProcess$ | async) === false || (isLoading$ | async)" (click)="onProcess()"
                class="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-black hover:shadow-[0_0_30px_rgba(20,184,166,0.4)] disabled:opacity-40 disabled:cursor-not-allowed">
                @if (isLoading$ | async) { <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div> Adding... } @else { 💧 Add Watermark }
              </button>
            </div>
          }
          @if ((state$ | async)?.status === 'error') { <div class="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400">⚠️ {{ (state$ | async)?.errorMessage }}</div> }
        </div>
        <div class="space-y-4">
          @if ((state$ | async)?.inputFile) { <app-video-preview [file]="(state$ | async)?.inputFile ?? null" [showControls]="true" /> }
          @if ((state$ | async)?.status === 'processing') { <div class="flex justify-center p-8"><app-progress-ring [progress]="(state$ | async)?.progress ?? 0" label="Adding Watermark..." [size]="120" /></div> }
          @if ((state$ | async)?.status === 'done') { <app-export-panel [outputBlob]="(state$ | async)?.outputBlob ?? null" [outputSizeMB]="(state$ | async)?.outputSizeMB ?? null" defaultFilename="omni_watermark" /> }
        </div>
      </div>
    </div>
  ` })
export class WatermarkComponent implements OnDestroy {
  private store = inject(Store);
  private ffmpeg = inject(FFmpegService);
  private bridge = inject(WorkerBridgeService);
  state$ = this.store.select(selectWatermarkState);
  isLoading$ = this.store.select(selectWatermarkIsLoading);
  canProcess$ = this.store.select(selectWatermarkCanProcess);

  wmMode: 'text' | 'image' = 'text';
  wmText = 'Omni-Tool';
  wmFontSize = 24;
  wmImage: File | null = null;
  wmImageName = '';
  wmPosition = 'BR';
  wmOpacity = 80;
  positionGrid = ['TL', 'TC', 'TR', 'ML', 'MC', 'MR', 'BL', 'BC', 'BR'];

  getValue(e: Event): string { return (e.target as HTMLInputElement).value; }

  async onFileSelected(files: File[]) {
    const file = files[0];
    this.store.dispatch(WatermarkActions.loadFile({ file }));
    try { const meta = await this.ffmpeg.getMetadata(file); this.store.dispatch(WatermarkActions.loadMetaSuccess({ meta })); }
    catch { this.store.dispatch(WatermarkActions.loadMetaFailure({ errorCode: 'FILE_CORRUPTED', message: 'Could not read video metadata.' })); }
  }

  onWmText(e: Event) { this.wmText = (e.target as HTMLInputElement).value; }
  onWmImage(e: Event) { const f = (e.target as HTMLInputElement).files?.[0]; if (f) { this.wmImage = f; this.wmImageName = f.name; } }

  onProcess() {
    this.store.dispatch(WatermarkActions.startProcessing());
    this.state$.subscribe(state => {
      if (!state.inputFile) return;
      this.bridge.process<unknown, Blob>(
        () => new Worker(new URL('./watermark.worker', import.meta.url), { type: 'module' }),
        { file: state.inputFile, mode: this.wmMode, text: this.wmText, fontSize: this.wmFontSize, imageFile: this.wmImage, position: this.wmPosition, opacity: this.wmOpacity / 100 }
      ).subscribe(msg => {
        if (msg.type === 'progress') this.store.dispatch(WatermarkActions.updateProgress({ progress: msg.value ?? 0 }));
        else if (msg.type === 'complete' && msg.data) { const b = msg.data as Blob; this.store.dispatch(WatermarkActions.processingSuccess({ outputBlob: b, outputSizeMB: b.size / 1_048_576 })); }
        else if (msg.type === 'error') { this.store.dispatch(WatermarkActions.processingFailure({ errorCode: msg.errorCode ?? 'UNKNOWN_ERROR', message: msg.message ?? 'Watermark failed' })); }
      });
    });
  }

  ngOnDestroy() { this.store.dispatch(WatermarkActions.resetState()); }
}
