import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { TrimmerActions, selectTrimmerState, selectStatus, selectProgress, selectOutputBlob } from './trimmer.store';
import { TrimmerService } from './trimmer.service';
import { take, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-trimmer',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-8 max-w-4xl mx-auto space-y-8">
      <header class="space-y-2">
        <h1 class="text-3xl font-bold flex items-center gap-3">
          <mat-icon class="text-accent-cyan">content_cut</mat-icon>
          Video Trimmer
        </h1>
        <p class="text-text-secondary">Cut and trim your videos with precision. Fast, client-side processing.</p>
      </header>

      <div class="glass-panel p-8 rounded-2xl border border-white/10 flex flex-col items-center justify-center gap-6 min-h-[300px] relative overflow-hidden group">
        @if ((status$ | async) === 'idle' || (status$ | async) === null || (status$ | async) === undefined) {
          <div class="flex flex-col items-center gap-4 text-center">
            <div class="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-accent-cyan/20 transition-colors duration-500">
              <mat-icon class="text-4xl text-text-secondary group-hover:text-accent-cyan transition-colors">upload_file</mat-icon>
            </div>
            <div>
              <p class="text-lg font-medium">Drop your video here</p>
              <p class="text-sm text-text-secondary">or click to browse files</p>
            </div>
            <input type="file" 
                   id="video-upload"
                   class="absolute inset-0 opacity-0 cursor-pointer" 
                   (change)="onFileSelected($event)" 
                   accept="video/*"
                   aria-label="Upload video file">
          </div>
        } @else if ((status$ | async) === 'loading' || (status$ | async) === 'processing') {
          <div class="flex flex-col items-center gap-6 w-full max-w-md">
            <div class="relative w-24 h-24">
              <svg class="w-full h-full rotate-[-90deg]" aria-hidden="true">
                <circle cx="48" cy="48" r="44" stroke="currentColor" stroke-width="8" fill="transparent" class="text-white/5" />
                <circle cx="48" cy="48" r="44" stroke="currentColor" stroke-width="8" fill="transparent" 
                        class="text-accent-cyan transition-all duration-300"
                        [style.stroke-dasharray]="276.46"
                        [style.stroke-dashoffset]="276.46 * (1 - ((progress$ | async) || 0) / 100)" />
              </svg>
              <div class="absolute inset-0 flex items-center justify-center font-bold text-xl" aria-live="polite">
                {{ progress$ | async }}%
              </div>
            </div>
            <p class="text-accent-cyan animate-pulse font-medium">
              {{ (status$ | async) === 'loading' ? 'Analyzing Video...' : 'Trimming Frames...' }}
            </p>
          </div>
        } @else if ((status$ | async) === 'done') {
          <div class="flex flex-col items-center gap-6 text-center">
            <div class="w-20 h-20 rounded-full bg-status-success/20 flex items-center justify-center">
              <mat-icon class="text-5xl text-status-success">check_circle</mat-icon>
            </div>
            <div>
              <p class="text-xl font-bold">Trimming Complete!</p>
              <p class="text-sm text-text-secondary">Your trimmed video is ready.</p>
            </div>
            <div class="flex gap-4">
              <button (click)="download()" 
                      (keyup.enter)="download()"
                      tabindex="0"
                      class="px-6 py-3 rounded-xl bg-accent-cyan text-black font-bold hover:scale-105 transition-transform flex items-center gap-2">
                <mat-icon>download</mat-icon> Download
              </button>
              <button (click)="reset()" 
                      (keyup.enter)="reset()"
                      tabindex="0"
                      class="px-6 py-3 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 transition-colors">
                Start Over
              </button>
            </div>
          </div>
        } @else if ((status$ | async) === 'error') {
          <div class="flex flex-col items-center gap-6 text-center text-status-error">
            <mat-icon class="text-6xl">error_outline</mat-icon>
            <div>
              <p class="text-xl font-bold">Something went wrong</p>
              <p class="text-sm opacity-80">{{ (state$ | async)?.errorMessage }}</p>
            </div>
            <button (click)="reset()" 
                    (keyup.enter)="reset()"
                    tabindex="0"
                    class="px-6 py-3 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 transition-colors">
              Try Again
            </button>
          </div>
        }
      </div>

      @if ((state$ | async)?.videoMeta; as meta) {
        <div class="glass-panel p-6 rounded-2xl border border-white/5 space-y-6">
          <div class="flex justify-between items-center">
            <h3 class="font-bold text-lg">Trim Settings</h3>
            <div class="flex gap-4 text-sm font-mono">
              <span class="text-accent-cyan">Start: {{ service.formatTime((state$ | async)?.startTime || 0) }}</span>
              <span class="text-accent-purple">End: {{ service.formatTime((state$ | async)?.endTime || 0) }}</span>
            </div>
          </div>
          
          <div class="space-y-4">
            <div class="relative h-12 bg-white/5 rounded-lg overflow-hidden border border-white/10">
              <div class="absolute inset-y-0 bg-accent-cyan/20 border-x border-accent-cyan/50"
                   [style.left.%]="((state$ | async)?.startTime || 0) / meta.duration * 100"
                   [style.right.%]="100 - (((state$ | async)?.endTime || 0) / meta.duration * 100)">
              </div>
            </div>
            
            <div class="grid grid-cols-2 gap-6">
              <div class="space-y-2">
                <label for="start-time" class="text-xs uppercase tracking-widest text-text-secondary">Start Time (s)</label>
                <input type="number" 
                       id="start-time"
                       [value]="(state$ | async)?.startTime" 
                       (input)="onRangeChange($event, 'start')"
                       class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:border-accent-cyan outline-none transition-colors">
              </div>
              <div class="space-y-2">
                <label for="end-time" class="text-xs uppercase tracking-widest text-text-secondary">End Time (s)</label>
                <input type="number" 
                       id="end-time"
                       [value]="(state$ | async)?.endTime" 
                       (input)="onRangeChange($event, 'end')"
                       class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:border-accent-purple outline-none transition-colors">
              </div>
            </div>
          </div>
        </div>
        
        <div class="flex justify-center pt-4">
          <button (click)="start()" 
                  (keyup.enter)="start()"
                  [disabled]="(status$ | async) !== 'idle'" 
                  tabindex="0"
                  class="px-12 py-4 rounded-2xl bg-gradient-to-r from-accent-cyan to-accent-purple text-white font-bold text-lg shadow-glow hover:scale-105 disabled:opacity-50 disabled:scale-100 transition-all duration-300">
            TRIM VIDEO
          </button>
        </div>
      }
    </div>
  `
})
export class TrimmerComponent implements OnDestroy {
  private store = inject(Store);
  public service = inject(TrimmerService);
  private destroy$ = new Subject<void>();

  state$ = this.store.select(selectTrimmerState);
  status$ = this.store.select(selectStatus);
  progress$ = this.store.select(selectProgress);
  outputBlob$ = this.store.select(selectOutputBlob);

  async onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.store.dispatch(TrimmerActions.loadFile({ file }));
      
      try {
        const meta = await this.service.getVideoMetadata(file);
        this.store.dispatch(TrimmerActions.loadMetaSuccess({
          meta: {
            ...meta,
            codec: 'h264', // Default for now, could be extracted more precisely
            size: file.size
          }
        }));
      } catch (error) {
        this.store.dispatch(TrimmerActions.processingFailure({ 
          errorCode: 'UNKNOWN_ERROR', 
          message: String(error) 
        }));
      }
    }
  }

  onRangeChange(event: Event, type: 'start' | 'end') {
    const val = Number((event.target as HTMLInputElement).value);
    this.state$.pipe(take(1)).subscribe(state => {
      if (state.videoMeta) {
        let start = state.startTime;
        let end = state.endTime;
        if (type === 'start') start = Math.max(0, Math.min(val, end - 1));
        else end = Math.min(state.videoMeta.duration, Math.max(val, start + 1));
        this.store.dispatch(TrimmerActions.updateRange({ start, end }));
      }
    });
  }

  start() {
    this.store.dispatch(TrimmerActions.startProcessing());
    
    const worker = new Worker(new URL('./trimmer.worker', import.meta.url));
    
    this.state$.pipe(takeUntil(this.destroy$)).subscribe(state => {
      if (state.status === 'processing' && state.inputFile) {
        worker.postMessage({ config: { 
          inputFile: state.inputFile, 
          startTime: state.startTime, 
          endTime: state.endTime 
        } });
      }
    });

    worker.onmessage = ({ data }) => {
      if (data.type === 'progress') {
        this.store.dispatch(TrimmerActions.updateProgress({ progress: data.value }));
      } else if (data.type === 'complete') {
        this.store.dispatch(TrimmerActions.processingSuccess({ 
          outputBlob: data.data, 
          outputSizeMB: data.data.size / 1024 / 1024 
        }));
        worker.terminate();
        this.destroy$.next();
      } else if (data.type === 'error') {
        this.store.dispatch(TrimmerActions.processingFailure({ 
          errorCode: data.errorCode, 
          message: data.message 
        }));
        worker.terminate();
        this.destroy$.next();
      }
    };
  }

  download() {
    this.outputBlob$.pipe(take(1)).subscribe(blob => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `trimmed_video_${Date.now()}.mp4`;
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 150);
      }
    });
  }

  reset() {
    this.store.dispatch(TrimmerActions.resetState());
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
