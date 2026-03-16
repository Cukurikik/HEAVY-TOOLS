import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { FileDropZoneComponent } from '../shared/components/file-drop-zone/file-drop-zone.component';
import { ProgressRingComponent } from '../shared/components/progress-ring/progress-ring.component';
import { ExportPanelComponent } from '../shared/components/export-panel/export-panel.component';
import { MergerActions, selectMergerState, selectMergerIsLoading, selectMergerCanProcess } from './merger.store';
import { FFmpegService } from '../shared/engine/ffmpeg.service';
import { WorkerBridgeService } from '../shared/engine/worker-bridge.service';
import { VideoToolLayoutComponent } from '../shared/components/video-tool-layout/video-tool-layout.component';

@Component({
  selector: 'app-merger',
  standalone: true,
  imports: [CommonModule, FileDropZoneComponent, ProgressRingComponent, ExportPanelComponent, VideoToolLayoutComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-video-tool-layout
      title="🔗 Video Merger"
      description="Merge multiple video clips into one seamless video"
      gradientClass="from-blue-400 to-indigo-200">
      <div leftPanel class="space-y-4">
        <app-file-drop-zone accept="video/*" label="Drop video clips here (multiple files)" [multiple]="true" (filesSelected)="onFilesSelected($event)" />

          <!-- Clips List -->
          @if (clips.length > 0) {
            <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-xs text-white/40 uppercase tracking-wider">Clips ({{ clips.length }})</span>
                <button (click)="clearClips()" class="text-xs text-red-400 hover:text-red-300 transition-colors">Clear All</button>
              </div>

              <div class="space-y-2 max-h-64 overflow-y-auto">
                @for (clip of clips; track $index) {
                  <div class="flex items-center gap-3 p-2 rounded-lg bg-white/5 border border-white/10">
                    <span class="w-6 h-6 flex items-center justify-center rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold">{{ $index + 1 }}</span>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm text-white truncate">{{ clip.name }}</p>
                      <p class="text-xs text-white/30">{{ (clip.size / 1_048_576) | number:'1.0-1' }} MB</p>
                    </div>
                    <button (click)="removeClip($index)" class="text-xs text-red-400 hover:text-red-300 px-2 py-1 rounded-lg hover:bg-red-500/10 transition-all">✕</button>
                  </div>
                }
              </div>

              <!-- Add More -->
              <button (click)="addMoreInput.click()" class="w-full py-2 rounded-lg border border-dashed border-white/20 text-xs text-white/40 hover:text-white/60 hover:border-white/40 transition-all">
                + Add More Clips
              </button>
              <input #addMoreInput type="file" accept="video/*" multiple class="hidden" (change)="onAddMore($event)" />

              <button [disabled]="clips.length < 2 || (isLoading$ | async)" (click)="onProcess()"
                class="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] disabled:opacity-40 disabled:cursor-not-allowed">
                @if (isLoading$ | async) {
                  <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  Merging...
                } @else { 🔗 Merge {{ clips.length }} Clips }
              </button>
            </div>
          }

          @if ((state$ | async)?.status === 'error') {
            <div class="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400">⚠️ {{ (state$ | async)?.errorMessage }}</div>
          }
      </div>
      <div rightPanel class="space-y-4">
        @if ((state$ | async)?.status === 'processing') {
            <div class="flex justify-center p-8">
              <app-progress-ring [progress]="(state$ | async)?.progress ?? 0" label="Merging clips..." [size]="120" />
            </div>
          }
          @if ((state$ | async)?.status === 'done') {
            <app-export-panel [outputBlob]="(state$ | async)?.outputBlob ?? null" [outputSizeMB]="(state$ | async)?.outputSizeMB ?? null" defaultFilename="omni_merged" />
          }
      </div>
    </app-video-tool-layout>
  ` })
export class MergerComponent implements OnDestroy {
  private store = inject(Store);
  private ffmpeg = inject(FFmpegService);
  private bridge = inject(WorkerBridgeService);

  state$ = this.store.select(selectMergerState);
  isLoading$ = this.store.select(selectMergerIsLoading);
  canProcess$ = this.store.select(selectMergerCanProcess);

  clips: File[] = [];

  onFilesSelected(files: File[]) {
    this.clips = [...this.clips, ...files];
    if (files.length > 0) {
      this.store.dispatch(MergerActions.loadFile({ file: files[0] }));
    }
  }

  onAddMore(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.clips = [...this.clips, ...Array.from(input.files)];
    }
    input.value = '';
  }

  removeClip(index: number) {
    this.clips = this.clips.filter((_, i) => i !== index);
  }

  clearClips() { this.clips = []; }

  onProcess() {
    this.store.dispatch(MergerActions.startProcessing());
    this.bridge.process<unknown, Blob>(
      () => new Worker(new URL('./merger.worker', import.meta.url), { type: 'module' }),
      { clips: this.clips.map(f => ({ file: f })), outputFormat: 'mp4' }
    ).subscribe(msg => {
      if (msg.type === 'progress') this.store.dispatch(MergerActions.updateProgress({ progress: msg.value ?? 0 }));
      else if (msg.type === 'complete' && msg.data) {
        const blob = msg.data as Blob;
        this.store.dispatch(MergerActions.processingSuccess({ outputBlob: blob, outputSizeMB: blob.size / 1_048_576 }));
      } else if (msg.type === 'error') {
        this.store.dispatch(MergerActions.processingFailure({ errorCode: msg.errorCode ?? 'UNKNOWN_ERROR', message: msg.message ?? 'Merge failed' }));
      }
    });
  }

  ngOnDestroy() { this.store.dispatch(MergerActions.resetState()); }
}
