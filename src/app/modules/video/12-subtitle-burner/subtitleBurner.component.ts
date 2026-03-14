import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { subtitleBurnerActions, subtitleBurnerFeature } from './subtitle-burner.store';
import { SubtitleBurnerService } from './subtitle-burner.service';

@Component({
  selector: 'app-subtitle-burner',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="p-8 glass-panel rounded-2xl max-w-4xl mx-auto">
      <h2 class="text-3xl font-bold mb-4 flex items-center gap-2">
        <mat-icon class="text-accent-cyan">subtitles</mat-icon> Subtitle Burner
      </h2>
      <p class="text-text-secondary mb-8">Hardcode subtitles (SRT/ASS) into your video.</p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <!-- Video Upload -->
        <div (click)="videoInput.click()"
             class="aspect-video bg-black/40 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-white/20 hover:border-accent-cyan/50 transition-all cursor-pointer group relative overflow-hidden">
          <input #videoInput type="file" (change)="onVideoSelected($event)" accept="video/*" class="hidden">
          @if ((state$ | async)?.videoFile === null || (state$ | async)?.videoFile === undefined) {
          <div class="text-center">
            <mat-icon class="text-5xl text-text-muted group-hover:text-accent-cyan transition-colors mb-2">movie</mat-icon>
            <p class="text-sm text-text-muted">Upload Video</p>
          </div>
          }
          @if ((state$ | async)?.videoFile; as file) {
          <div class="text-center p-4">
            <mat-icon class="text-4xl text-accent-cyan mb-2">check_circle</mat-icon>
            <p class="text-sm font-medium truncate max-w-[200px]">{{ file.name }}</p>
          </div>
          }
        </div>

        <!-- Subtitle Upload -->
        <div (click)="subInput.click()"
             class="aspect-video bg-black/40 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-white/20 hover:border-accent-cyan/50 transition-all cursor-pointer group relative overflow-hidden">
          <input #subInput type="file" (change)="onSubtitleSelected($event)" accept=".srt,.vtt,.ass" class="hidden">
          @if ((state$ | async)?.subtitleFile === null || (state$ | async)?.subtitleFile === undefined) {
          <div class="text-center">
            <mat-icon class="text-5xl text-text-muted group-hover:text-accent-cyan transition-colors mb-2">description</mat-icon>
            <p class="text-sm text-text-muted">Upload Subtitles (.srt, .vtt, .ass)</p>
          </div>
          }
          @if ((state$ | async)?.subtitleFile; as file) {
          <div class="text-center p-4">
            <mat-icon class="text-4xl text-accent-cyan mb-2">check_circle</mat-icon>
            <p class="text-sm font-medium truncate max-w-[200px]">{{ file.name }}</p>
          </div>
          }
        </div>
      </div>

      @if ((state$ | async)?.videoFile && (state$ | async)?.subtitleFile) {
      <div class="space-y-6">
        <div class="flex flex-col gap-4">
          @if ((state$ | async)?.outputUrl === null || (state$ | async)?.outputUrl === undefined) {
          <button
                  (click)="process()"
                  [disabled]="(state$ | async)?.isProcessing"
                  class="w-full py-4 bg-accent-cyan text-black font-bold rounded-xl hover:bg-accent-cyan/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2">
            @if ((state$ | async)?.isProcessing === false || (state$ | async)?.isProcessing === null || (state$ | async)?.isProcessing === undefined) {
            <mat-icon>play_arrow</mat-icon>
            }
            @if ((state$ | async)?.isProcessing) {
            <span class="animate-spin rounded-full h-5 w-5 border-2 border-black/20 border-t-black"></span>
            }
            {{ (state$ | async)?.isProcessing ? 'Burning Subtitles...' : 'Start Burning' }}
          </button>
          }

          @if ((state$ | async)?.isProcessing) {
          <div class="space-y-2">
            <div class="h-2 bg-white/10 rounded-full overflow-hidden">
              <div class="h-full bg-accent-cyan transition-all duration-300" [style.width.%]="(state$ | async)?.progress"></div>
            </div>
            <p class="text-center text-sm text-text-muted">Progress: {{ (state$ | async)?.progress }}%</p>
          </div>
          }

          @if ((state$ | async)?.outputUrl) {
          <a
             [href]="(state$ | async)?.outputUrl"
             [download]="'subtitled_' + (state$ | async)?.videoFile?.name"
             class="w-full py-4 bg-accent-green text-black font-bold rounded-xl hover:bg-accent-green/90 transition-all flex items-center justify-center gap-2">
            <mat-icon>download</mat-icon> Download Result
          </a>
          }

          <button (click)="reset()" class="w-full py-2 text-text-muted hover:text-text-primary transition-colors text-sm">
            Reset and Start Over
          </button>
        </div>
      </div>
      }

      @if ((state$ | async)?.error) {
      <div class="mt-6 p-4 bg-accent-red/20 border border-accent-red/50 rounded-xl text-accent-red flex items-center gap-3">
        <mat-icon>error</mat-icon>
        <span>{{ (state$ | async)?.error }}</span>
      </div>
      }
    </div>
  `
})
export class SubtitleBurnerComponent {
  private store = inject(Store);
  private service = inject(SubtitleBurnerService);
  state$ = this.store.select(subtitleBurnerFeature.selectSubtitleBurnerState);

  onVideoSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.store.dispatch(subtitleBurnerActions.loadVideo({ file }));
      setTimeout(() => {
        this.store.dispatch(subtitleBurnerActions.setMeta({
          meta: { duration: 120, size: file.size, name: file.name }
        }));
      }, 500);
    }
  }

  onSubtitleSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.store.dispatch(subtitleBurnerActions.loadSubtitle({ file }));
    }
  }

  process() {
    this.state$.subscribe(state => {
      if (!state.videoFile || !state.subtitleFile) return;

      this.store.dispatch(subtitleBurnerActions.startProcessing());

      const worker = new Worker(new URL('./subtitle-burner.worker', import.meta.url));
      worker.onmessage = ({ data }) => {
        if (data.type === 'progress') {
          this.store.dispatch(subtitleBurnerActions.setProgress({ progress: data.value }));
        } else if (data.type === 'complete') {
          const url = URL.createObjectURL(data.data);
          this.store.dispatch(subtitleBurnerActions.completeProcessing({ outputUrl: url }));
          worker.terminate();
        } else if (data.type === 'error') {
          this.store.dispatch(subtitleBurnerActions.setError({ error: data.message }));
          worker.terminate();
        }
      };

      worker.postMessage({
        config: {
          videoFile: state.videoFile,
          subtitleFile: state.subtitleFile
        }
      });
    }).unsubscribe();
  }

  reset() {
    this.store.dispatch(subtitleBurnerActions.reset());
  }
}
