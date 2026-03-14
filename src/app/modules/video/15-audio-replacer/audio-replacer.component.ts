import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { AudioReplacerActions, selectAudioReplacerState, selectStatus, selectProgress, selectOutputBlob } from './audio-replacer.store';
import { AudioReplacerService } from './audio-replacer.service';

@Component({
  selector: 'app-audio-replacer',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-8 max-w-4xl mx-auto space-y-8">
      <header class="space-y-2">
        <h1 class="text-3xl font-bold flex items-center gap-3">
          <mat-icon class="text-accent-cyan">swap_calls</mat-icon>
          Audio Replacer
        </h1>
        <p class="text-text-secondary">Replace the existing audio in your video with a new audio file.</p>
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

        <!-- Audio Upload -->
        <div class="glass-panel p-8 rounded-2xl border border-white/10 flex flex-col items-center justify-center gap-4 min-h-[200px] relative overflow-hidden group">
          @if ((state$ | async)?.audioFile === null || (state$ | async)?.audioFile === undefined) {
            <mat-icon class="text-4xl text-text-secondary group-hover:text-accent-purple transition-colors">audiotrack</mat-icon>
            <div class="text-center">
              <p class="font-medium">Upload New Audio</p>
              <p class="text-xs text-text-secondary">MP3, WAV, AAC...</p>
            </div>
            <input type="file" class="absolute inset-0 opacity-0 cursor-pointer" (change)="onAudioSelected($event)" accept="audio/*">
          } @else {
            <mat-icon class="text-4xl text-accent-purple">check_circle</mat-icon>
            <p class="font-medium text-accent-purple truncate max-w-full px-4">{{ (state$ | async)?.audioFile?.name }}</p>
            <button (click)="resetAudio()" class="text-xs text-status-error hover:underline">Change Audio</button>
          }
        </div>
      </div>

      @if ((status$ | async) === 'processing') {
        <div class="glass-panel p-8 rounded-2xl border border-white/10 flex flex-col items-center gap-6">
          <div class="w-full bg-white/5 h-2 rounded-full overflow-hidden">
            <div class="h-full bg-accent-cyan transition-all duration-300" [style.width.%]="progress$ | async"></div>
          </div>
          <p class="text-accent-cyan animate-pulse font-medium">Replacing Audio... {{ progress$ | async }}%</p>
        </div>
      }

      @if ((status$ | async) === 'done') {
        <div class="glass-panel p-8 rounded-2xl border border-status-success/30 flex flex-col items-center gap-6 text-center">
          <mat-icon class="text-6xl text-status-success">verified</mat-icon>
          <div>
            <p class="text-xl font-bold">Replacement Complete!</p>
            <p class="text-sm text-text-secondary">Your video now has the new audio track.</p>
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

      @if ((state$ | async)?.inputFile && (state$ | async)?.audioFile) {
        <div class="flex justify-center pt-4">
          <button (click)="start()" [disabled]="(status$ | async) === 'processing'" 
                  class="px-12 py-4 rounded-2xl bg-gradient-to-r from-accent-cyan to-accent-purple text-white font-bold text-lg shadow-glow hover:scale-105 disabled:opacity-50 disabled:scale-100 transition-all duration-300">
            REPLACE AUDIO
          </button>
        </div>
      }
    </div>
  `
})
export class AudioReplacerComponent {
  private store = inject(Store);
  public service = inject(AudioReplacerService);

  state$ = this.store.select(selectAudioReplacerState);
  status$ = this.store.select(selectStatus);
  progress$ = this.store.select(selectProgress);
  outputBlob$ = this.store.select(selectOutputBlob);

  onVideoSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.store.dispatch(AudioReplacerActions.loadFile({ file }));
    }
  }

  onAudioSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.store.dispatch(AudioReplacerActions.loadAudio({ file }));
    }
  }

  start() {
    this.store.dispatch(AudioReplacerActions.startProcessing());
    const worker = new Worker(new URL('./audio-replacer.worker', import.meta.url));
    
    this.state$.subscribe(state => {
      if (state.status === 'processing' && state.inputFile && state.audioFile) {
        worker.postMessage({ config: { 
          inputFile: state.inputFile, 
          audioFile: state.audioFile
        } });
      }
    }).unsubscribe();

    worker.onmessage = ({ data }) => {
      if (data.type === 'progress') {
        this.store.dispatch(AudioReplacerActions.updateProgress({ progress: data.value }));
      } else if (data.type === 'complete') {
        this.store.dispatch(AudioReplacerActions.processingSuccess({ 
          outputBlob: data.data, 
          outputSizeMB: data.data.size / 1024 / 1024 
        }));
        worker.terminate();
      } else if (data.type === 'error') {
        this.store.dispatch(AudioReplacerActions.processingFailure({ 
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
        a.download = `audio_replaced_video_${Date.now()}.mp4`;
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 150);
      }
    }).unsubscribe();
  }

  resetVideo() { this.store.dispatch(AudioReplacerActions.resetState()); }
  resetAudio() { /* logic to clear audio only */ }
  reset() { this.store.dispatch(AudioReplacerActions.resetState()); }
}
