import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { MatIconModule } from '@angular/material/icon';
import { FileDropZoneComponent } from '../shared/components/file-drop-zone/file-drop-zone.component';
import { ProgressRingComponent } from '../shared/components/progress-ring/progress-ring.component';
import { ExportPanelComponent } from '../shared/components/export-panel/export-panel.component';
import { MergerActions, selectMergerState, selectMergerIsLoading, selectMergerCanProcess } from './merger.store';
import { FFmpegService } from '../shared/engine/ffmpeg.service';
import { WorkerBridgeService } from '../shared/engine/worker-bridge.service';

@Component({
  selector: 'app-merger',
  standalone: true,
  imports: [CommonModule, FileDropZoneComponent, ProgressRingComponent, ExportPanelComponent, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-[#040409] text-white p-6 md:p-10 space-y-8 relative overflow-hidden">
      <!-- Background Ambient Glow -->
      <div class="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <header class="space-y-2 relative z-10">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400/20 to-indigo-600/20 flex items-center justify-center border border-white/10 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
            <span class="text-2xl">🔗</span>
          </div>
          <div>
            <h1 class="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 tracking-tight">
              Video Merger
            </h1>
            <p class="text-indigo-200/50 text-xs uppercase tracking-widest font-medium mt-1">Seamless Sequence Assembler</p>
          </div>
        </div>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
        <div class="space-y-6">
          <app-file-drop-zone accept="video/*" label="Drop multiple video clips to sequence" [multiple]="true" (filesSelected)="onFilesSelected($event)" />

          @if (clips.length > 0) {
            <div class="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl space-y-6 animate-[fadeSlideUp_0.4s_ease-out]">
              
              <div class="flex justify-between items-end border-b border-white/10 pb-4">
                <div>
                  <h3 class="text-lg font-bold text-white">Clip Sequence</h3>
                  <p class="text-xs text-white/40 uppercase tracking-widest mt-1">{{ clips.length }} Items Loaded</p>
                </div>
                <button (click)="clearClips()" class="text-xs font-bold uppercase tracking-widest text-red-400 hover:text-red-300 transition-colors bg-red-500/10 px-3 py-1.5 rounded-lg border border-red-500/20">Clear All</button>
              </div>

              <div class="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                @for (clip of clips; track $index) {
                  <div class="flex items-center gap-4 p-3 rounded-2xl bg-black/40 border border-white/5 group hover:border-indigo-400/30 transition-all">
                    <div class="w-8 h-8 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 text-indigo-300 text-sm font-black border border-white/5 shadow-inner">
                      {{ $index + 1 }}
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium text-white truncate">{{ clip.name }}</p>
                      <p class="text-xs font-mono text-white/40 mt-0.5">{{ (clip.size / 1_048_576) | number:'1.0-1' }} MB</p>
                    </div>
                    <button (click)="removeClip($index)" class="w-8 h-8 rounded-xl flex items-center justify-center text-red-400 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 hover:text-red-300 transition-all">
                      ✕
                    </button>
                  </div>
                }
              </div>

              <button (click)="addMoreInput.click()" class="w-full py-4 rounded-2xl border-2 border-dashed border-white/10 bg-white/5 text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white hover:border-indigo-400/50 hover:bg-indigo-500/5 transition-all">
                + Append More Clips
              </button>
              <input #addMoreInput type="file" accept="video/*" multiple class="hidden" (change)="onAddMore($event)" />

              <button [disabled]="clips.length < 2 || (isLoading$ | async)" (click)="onProcess()"
                class="w-full py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all duration-300 flex items-center justify-center gap-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] disabled:opacity-30 disabled:hover:shadow-none mt-4">
                @if (isLoading$ | async) {
                  <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Fusing Sequence...
                } @else { 
                  <mat-icon class="text-[18px]">link</mat-icon> Initiate Merge ({{ clips.length }} Clips)
                }
              </button>
            </div>
          }

          @if ((state$ | async)?.status === 'error') {
            <div class="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-sm font-medium text-red-400 flex items-center gap-3 animate-pulse">
              <mat-icon>error_outline</mat-icon> {{ (state$ | async)?.errorMessage }}
            </div>
          }
        </div>

        <div class="space-y-6">
          @if ((state$ | async)?.status === 'processing') {
            <div class="flex justify-center flex-col items-center gap-6 p-12 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md">
              <app-progress-ring [progress]="(state$ | async)?.progress ?? 0" label="Fusing sequence..." [size]="140" />
              <p class="text-xs text-indigo-300/60 uppercase tracking-widest font-mono text-center">Processing multiplexed streams via highly-optimized WebAssembly Engine</p>
            </div>
          }
          @if ((state$ | async)?.status === 'done') {
            <div class="animate-[fadeSlideUp_0.4s_ease-out]">
              <app-export-panel [outputBlob]="(state$ | async)?.outputBlob ?? null" [outputSizeMB]="(state$ | async)?.outputSizeMB ?? null" defaultFilename="omni_merged" />
            </div>
          }
        </div>
      </div>
    </div>
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
