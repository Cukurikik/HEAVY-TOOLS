import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { MuterActions, selectMuterState, selectStatus, selectProgress, selectOutputBlob } from './muter.store';
import { MuterService } from './muter.service';

@Component({
  selector: 'app-muter',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-8 max-w-4xl mx-auto space-y-8">
      <header class="space-y-2">
        <h1 class="text-3xl font-bold flex items-center gap-3">
          <mat-icon class="text-accent-cyan">volume_off</mat-icon>
          Video Muter
        </h1>
        <p class="text-text-secondary">Remove audio from your videos quickly and easily.</p>
      </header>

      <div class="glass-panel p-8 rounded-2xl border border-white/10 flex flex-col items-center justify-center gap-6 min-h-[300px] relative overflow-hidden group">
        @if ((status$ | async) === null || (status$ | async) === undefined || (status$ | async) === 'idle') {
          <div class="flex flex-col items-center gap-4 text-center">
            <div class="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-accent-cyan/20 transition-colors duration-500">
              <mat-icon class="text-4xl text-text-secondary group-hover:text-accent-cyan transition-colors">upload_file</mat-icon>
            </div>
            <div>
              <p class="text-lg font-medium">Drop your video here</p>
              <p class="text-sm text-text-secondary">or click to browse files</p>
            </div>
            <input type="file" class="absolute inset-0 opacity-0 cursor-pointer" (change)="onFileSelected($event)" accept="video/*">
          </div>
        } @else if ((status$ | async) === 'loading' || (status$ | async) === 'processing') {
          <div class="flex flex-col items-center gap-6 w-full max-w-md">
            <div class="relative w-24 h-24">
              <svg class="w-full h-full rotate-[-90deg]">
                <circle cx="48" cy="48" r="44" stroke="currentColor" stroke-width="8" fill="transparent" class="text-white/5" />
                <circle cx="48" cy="48" r="44" stroke="currentColor" stroke-width="8" fill="transparent" 
                        class="text-accent-cyan transition-all duration-300"
                        [style.stroke-dasharray]="276.46"
                        [style.stroke-dashoffset]="276.46 * (1 - ((progress$ | async) || 0) / 100)" />
              </svg>
              <div class="absolute inset-0 flex items-center justify-center font-bold text-xl">
                {{ progress$ | async }}%
              </div>
            </div>
            <p class="text-accent-cyan animate-pulse font-medium">
              {{ (status$ | async) === 'loading' ? 'Analyzing Video...' : 'Removing Audio...' }}
            </p>
          </div>
        } @else if ((status$ | async) === 'done') {
          <div class="flex flex-col items-center gap-6 text-center">
            <div class="w-20 h-20 rounded-full bg-status-success/20 flex items-center justify-center">
              <mat-icon class="text-5xl text-status-success">check_circle</mat-icon>
            </div>
            <div>
              <p class="text-xl font-bold">Audio Removed!</p>
              <p class="text-sm text-text-secondary">Your silent video is ready.</p>
            </div>
            <div class="flex gap-4">
              <button (click)="download()" class="px-6 py-3 rounded-xl bg-accent-cyan text-black font-bold hover:scale-105 transition-transform flex items-center gap-2">
                <mat-icon>download</mat-icon> Download
              </button>
              <button (click)="reset()" class="px-6 py-3 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 transition-colors">
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
            <button (click)="reset()" class="px-6 py-3 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 transition-colors">
              Try Again
            </button>
          </div>
        }
      </div>

      @if ((state$ | async)?.videoMeta; as meta) {
        <div class="flex justify-center pt-4">
          <button (click)="start()" [disabled]="(status$ | async) !== 'idle'" 
                  class="px-12 py-4 rounded-2xl bg-gradient-to-r from-accent-cyan to-accent-purple text-white font-bold text-lg shadow-glow hover:scale-105 disabled:opacity-50 disabled:scale-100 transition-all duration-300">
            MUTE VIDEO
          </button>
        </div>
      }
    </div>
  `
})
export class MuterComponent {
  private store = inject(Store);
  public service = inject(MuterService);

  state$ = this.store.select(selectMuterState);
  status$ = this.store.select(selectStatus);
  progress$ = this.store.select(selectProgress);
  outputBlob$ = this.store.select(selectOutputBlob);

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.store.dispatch(MuterActions.loadFile({ file }));
      
      // Mock meta loading
      setTimeout(() => {
        this.store.dispatch(MuterActions.loadMetaSuccess({
          meta: {
            filename: file.name,
            fileSizeMB: file.size / 1024 / 1024,
            duration: 120,
            width: 1920,
            height: 1080,
            fps: 30,
            codec: 'h264',
            audioCodec: 'aac',
            audioBitrate: 128000,
            videoBitrate: 2500000,
            bitrate: 2628000,
            sampleRate: 44100,
            hasAudio: true,
            aspectRatio: '16:9'
          }
        }));
      }, 1000);
    }
  }

  start() {
    this.store.dispatch(MuterActions.startProcessing());
    
    const worker = new Worker(new URL('./muter.worker', import.meta.url));
    
    this.state$.subscribe(state => {
      if (state.status === 'processing' && state.inputFile) {
        worker.postMessage({ config: { inputFile: state.inputFile } });
      }
    }).unsubscribe();

    worker.onmessage = ({ data }) => {
      if (data.type === 'progress') {
        this.store.dispatch(MuterActions.updateProgress({ progress: data.value }));
      } else if (data.type === 'complete') {
        this.store.dispatch(MuterActions.processingSuccess({ 
          outputBlob: data.data, 
          outputSizeMB: data.data.size / 1024 / 1024 
        }));
        worker.terminate();
      } else if (data.type === 'error') {
        this.store.dispatch(MuterActions.processingFailure({ 
          errorCode: data.errorCode, 
          message: data.message 
        }));
        worker.terminate();
      }
    };
  }

  download() {
    this.outputBlob$.subscribe(blob => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `muted_video_${Date.now()}.mp4`;
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 150);
      }
    }).unsubscribe();
  }

  reset() {
    this.store.dispatch(MuterActions.resetState());
  }
}
