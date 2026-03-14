import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { SubtitleActions, selectSubtitleState, selectStatus, selectProgress, selectOutputBlob } from './subtitle.store';
import { SubtitleService } from './subtitle.service';

@Component({
  selector: 'app-subtitle',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-8 max-w-4xl mx-auto space-y-8">
      <header class="space-y-2">
        <h1 class="text-3xl font-bold flex items-center gap-3">
          <mat-icon class="text-accent-cyan">subtitles</mat-icon>
          Subtitle Burner
        </h1>
        <p class="text-text-secondary">Hardburn subtitles into your video. Supports SRT and VTT formats.</p>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Video Upload -->
        <div class="glass-panel p-8 rounded-2xl border border-white/10 flex flex-col items-center justify-center gap-4 min-h-[200px] relative overflow-hidden group">
          @if ((state$ | async)?.inputFile === null || (state$ | async)?.inputFile === undefined) {
            <mat-icon class="text-4xl text-text-secondary group-hover:text-accent-cyan transition-colors">movie</mat-icon>
            <div class="text-center">
              <p class="font-medium">Upload Video</p>
              <p class="text-xs text-text-secondary">MP4, MOV, AVI...</p>
            </div>
            <input type="file" class="absolute inset-0 opacity-0 cursor-pointer" (change)="onVideoSelected($event)" accept="video/*">
          } @else {
            <mat-icon class="text-4xl text-accent-cyan">check_circle</mat-icon>
            <p class="font-medium text-accent-cyan truncate max-w-full px-4">{{ (state$ | async)?.inputFile?.name }}</p>
            <button (click)="resetVideo()" class="text-xs text-status-error hover:underline">Change Video</button>
          }
        </div>

        <!-- Subtitle Upload -->
        <div class="glass-panel p-8 rounded-2xl border border-white/10 flex flex-col items-center justify-center gap-4 min-h-[200px] relative overflow-hidden group">
          @if ((state$ | async)?.subtitleFile === null || (state$ | async)?.subtitleFile === undefined) {
            <mat-icon class="text-4xl text-text-secondary group-hover:text-accent-purple transition-colors">description</mat-icon>
            <div class="text-center">
              <p class="font-medium">Upload Subtitle</p>
              <p class="text-xs text-text-secondary">SRT, VTT</p>
            </div>
            <input type="file" class="absolute inset-0 opacity-0 cursor-pointer" (change)="onSubtitleSelected($event)" accept=".srt,.vtt">
          } @else {
            <mat-icon class="text-4xl text-accent-purple">check_circle</mat-icon>
            <p class="font-medium text-accent-purple truncate max-w-full px-4">{{ (state$ | async)?.subtitleFile?.name }}</p>
            <button (click)="resetSubtitle()" class="text-xs text-status-error hover:underline">Change Subtitle</button>
          }
        </div>
      </div>

      @if ((status$ | async) === 'processing') {
        <div class="glass-panel p-8 rounded-2xl border border-white/10 flex flex-col items-center gap-6">
          <div class="w-full bg-white/5 h-2 rounded-full overflow-hidden">
            <div class="h-full bg-accent-cyan transition-all duration-300" [style.width.%]="progress$ | async"></div>
          </div>
          <p class="text-accent-cyan animate-pulse font-medium">Burning Subtitles... {{ progress$ | async }}%</p>
        </div>
      }

      @if ((status$ | async) === 'done') {
        <div class="glass-panel p-8 rounded-2xl border border-status-success/30 flex flex-col items-center gap-6 text-center">
          <mat-icon class="text-6xl text-status-success">verified</mat-icon>
          <div>
            <p class="text-xl font-bold">Burning Complete!</p>
            <p class="text-sm text-text-secondary">Subtitles are now part of the video.</p>
          </div>
          <div class="flex gap-4">
            <button (click)="download()" class="px-8 py-3 rounded-xl bg-accent-cyan text-black font-bold hover:scale-105 transition-transform">
              Download Video
            </button>
            <button (click)="reset()" class="px-8 py-3 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 transition-colors">
              Start Over
            </button>
          </div>
        </div>
      }

      @if ((state$ | async)?.inputFile && (state$ | async)?.subtitleFile) {
        <div class="flex justify-center pt-4">
          <button (click)="start()" [disabled]="(status$ | async) === 'processing'" 
                  class="px-12 py-4 rounded-2xl bg-gradient-to-r from-accent-cyan to-accent-purple text-white font-bold text-lg shadow-glow hover:scale-105 disabled:opacity-50 disabled:scale-100 transition-all duration-300">
            BURN SUBTITLES
          </button>
        </div>
      }
    </div>
  `
})
export class SubtitleComponent {
  private store = inject(Store);
  public service = inject(SubtitleService);

  state$ = this.store.select(selectSubtitleState);
  status$ = this.store.select(selectStatus);
  progress$ = this.store.select(selectProgress);
  outputBlob$ = this.store.select(selectOutputBlob);

  onVideoSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.store.dispatch(SubtitleActions.loadFile({ file }));
    }
  }

  onSubtitleSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.store.dispatch(SubtitleActions.loadSubtitle({ file }));
    }
  }

  start() {
    this.store.dispatch(SubtitleActions.startProcessing());
    const worker = new Worker(new URL('./subtitle.worker', import.meta.url));
    
    this.state$.subscribe(state => {
      if (state.status === 'processing' && state.inputFile && state.subtitleFile) {
        worker.postMessage({ config: { 
          inputFile: state.inputFile, 
          subtitleFile: state.subtitleFile
        } });
      }
    }).unsubscribe();

    worker.onmessage = ({ data }) => {
      if (data.type === 'progress') {
        this.store.dispatch(SubtitleActions.updateProgress({ progress: data.value }));
      } else if (data.type === 'complete') {
        this.store.dispatch(SubtitleActions.processingSuccess({ 
          outputBlob: data.data, 
          outputSizeMB: data.data.size / 1024 / 1024 
        }));
        worker.terminate();
      } else if (data.type === 'error') {
        this.store.dispatch(SubtitleActions.processingFailure({ 
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
        a.download = `subtitled_video_${Date.now()}.mp4`;
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 150);
      }
    }).unsubscribe();
  }

  resetVideo() { this.store.dispatch(SubtitleActions.resetState()); }
  resetSubtitle() {
    this.store.dispatch(SubtitleActions.resetSubtitle());
  }
  reset() { this.store.dispatch(SubtitleActions.resetState()); }
}
