import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { WatermarkActions, selectWatermarkState, selectStatus, selectProgress, selectOutputBlob } from './watermark.store';
import { WatermarkService } from './watermark.service';
import { take, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-watermark',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-8 max-w-4xl mx-auto space-y-8">
      <header class="space-y-2">
        <h1 class="text-3xl font-bold flex items-center gap-3">
          <mat-icon class="text-accent-cyan">branding_watermark</mat-icon>
          Video Watermark
        </h1>
        <p class="text-text-secondary">Protect your content by adding a custom image watermark to your videos.</p>
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
            <input type="file" 
                   id="video-upload"
                   class="absolute inset-0 opacity-0 cursor-pointer" 
                   (change)="onVideoSelected($event)" 
                   accept="video/*"
                   aria-label="Upload video file">
          } @else {
            <mat-icon class="text-4xl text-accent-cyan">check_circle</mat-icon>
            <p class="font-medium text-accent-cyan">{{ (state$ | async)?.inputFile?.name }}</p>
            <button (click)="resetVideo()" 
                    (keyup.enter)="resetVideo()"
                    tabindex="0"
                    class="text-xs text-status-error hover:underline">Change Video</button>
          }
        </div>

        <!-- Watermark Upload -->
        <div class="glass-panel p-8 rounded-2xl border border-white/10 flex flex-col items-center justify-center gap-4 min-h-[200px] relative overflow-hidden group">
          @if ((state$ | async)?.watermarkFile === null || (state$ | async)?.watermarkFile === undefined) {
            <mat-icon class="text-4xl text-text-secondary group-hover:text-accent-purple transition-colors">image</mat-icon>
            <div class="text-center">
              <p class="font-medium">Upload Watermark</p>
              <p class="text-xs text-text-secondary">PNG, JPG (PNG recommended)</p>
            </div>
            <input type="file" 
                   id="watermark-upload"
                   class="absolute inset-0 opacity-0 cursor-pointer" 
                   (change)="onWatermarkSelected($event)" 
                   accept="image/*"
                   aria-label="Upload watermark image">
          } @else {
            <mat-icon class="text-4xl text-accent-purple">check_circle</mat-icon>
            <p class="font-medium text-accent-purple">{{ (state$ | async)?.watermarkFile?.name }}</p>
            <button (click)="resetWatermark()" 
                    (keyup.enter)="resetWatermark()"
                    tabindex="0"
                    class="text-xs text-status-error hover:underline">Change Watermark</button>
          }
        </div>
      </div>

      @if ((status$ | async) === 'processing') {
        <div class="glass-panel p-8 rounded-2xl border border-white/10 flex flex-col items-center gap-6">
          <div class="w-full bg-white/5 h-2 rounded-full overflow-hidden">
            <div class="h-full bg-accent-cyan transition-all duration-300" [style.width.%]="progress$ | async"></div>
          </div>
          <p class="text-accent-cyan animate-pulse font-medium">Applying Watermark... {{ progress$ | async }}%</p>
        </div>
      }

      @if ((status$ | async) === 'done') {
        <div class="glass-panel p-8 rounded-2xl border border-status-success/30 flex flex-col items-center gap-6 text-center">
          <mat-icon class="text-6xl text-status-success">verified</mat-icon>
          <div>
            <p class="text-xl font-bold">Watermark Applied!</p>
            <p class="text-sm text-text-secondary">Your protected video is ready.</p>
          </div>
          <div class="flex gap-4">
            <button (click)="download()" 
                    (keyup.enter)="download()"
                    tabindex="0"
                    class="px-8 py-3 rounded-xl bg-accent-cyan text-black font-bold hover:scale-105 transition-transform">
              Download Video
            </button>
            <button (click)="reset()" 
                    (keyup.enter)="reset()"
                    tabindex="0"
                    class="px-8 py-3 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 transition-colors">
              Start Over
            </button>
          </div>
        </div>
      }

      @if ((state$ | async)?.videoMeta; as meta) {
        <div class="glass-panel p-6 rounded-2xl border border-white/5 space-y-8">
          <h3 class="font-bold text-lg">Watermark Settings</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="space-y-4">
              <p class="text-sm font-medium text-text-secondary uppercase tracking-widest">Position</p>
              <div class="grid grid-cols-3 gap-2">
                @for (pos of ['top-left', 'top-right', 'center', 'bottom-left', 'bottom-right']; track pos) {
                  <button (click)="onPositionChange(pos)" 
                          (keyup.enter)="onPositionChange(pos)"
                          tabindex="0"
                          [class.bg-accent-cyan]="(state$ | async)?.position === pos"
                          [class.text-black]="(state$ | async)?.position === pos"
                          class="p-2 rounded-lg border border-white/10 text-xs capitalize hover:border-accent-cyan transition-all">
                    {{ pos.replace('-', ' ') }}
                  </button>
                }
              </div>
            </div>

            <div class="space-y-4">
              <label for="opacity-range" class="text-sm font-medium text-text-secondary uppercase tracking-widest">Opacity: {{ ((state$ | async)?.opacity || 0) * 100 }}%</label>
              <input type="range" 
                     id="opacity-range"
                     min="0.1" max="1" step="0.1" 
                     [value]="(state$ | async)?.opacity" 
                     (input)="onOpacityChange($event)"
                     class="w-full h-2 bg-white/5 rounded-lg appearance-none cursor-pointer accent-accent-cyan">
            </div>
          </div>
        </div>
        
        <div class="flex justify-center pt-4">
          <button (click)="start()" 
                  (keyup.enter)="start()"
                  [disabled]="(status$ | async) === 'processing' || (state$ | async)?.watermarkFile === null || (state$ | async)?.watermarkFile === undefined" 
                  tabindex="0"
                  class="px-12 py-4 rounded-2xl bg-gradient-to-r from-accent-cyan to-accent-purple text-white font-bold text-lg shadow-glow hover:scale-105 disabled:opacity-50 disabled:scale-100 transition-all duration-300">
            APPLY WATERMARK
          </button>
        </div>
      }
    </div>
  `
})
export class WatermarkComponent implements OnDestroy {
  private store = inject(Store);
  public service = inject(WatermarkService);
  private destroy$ = new Subject<void>();

  state$ = this.store.select(selectWatermarkState);
  status$ = this.store.select(selectStatus);
  progress$ = this.store.select(selectProgress);
  outputBlob$ = this.store.select(selectOutputBlob);

  async onVideoSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.store.dispatch(WatermarkActions.loadFile({ file }));
      try {
        const meta = await this.service.getVideoMetadata(file);
        this.store.dispatch(WatermarkActions.loadMetaSuccess({
          meta: { ...meta, codec: 'h264', size: file.size }
        }));
      } catch (error) {
        this.store.dispatch(WatermarkActions.processingFailure({ 
          errorCode: 'UNKNOWN_ERROR', 
          message: String(error) 
        }));
      }
    }
  }

  onWatermarkSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.store.dispatch(WatermarkActions.loadWatermark({ file }));
    }
  }

  onPositionChange(position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center') {
    this.store.dispatch(WatermarkActions.updateSettings({ position }));
  }

  onOpacityChange(event: Event) {
    const opacity = Number((event.target as HTMLInputElement).value);
    this.store.dispatch(WatermarkActions.updateSettings({ opacity }));
  }

  start() {
    this.store.dispatch(WatermarkActions.startProcessing());
    const worker = new Worker(new URL('./watermark.worker', import.meta.url));
    
    this.state$.pipe(takeUntil(this.destroy$)).subscribe(state => {
      if (state.status === 'processing' && state.inputFile && state.watermarkFile) {
        worker.postMessage({ config: { 
          inputFile: state.inputFile, 
          watermarkFile: state.watermarkFile,
          position: state.position,
          opacity: state.opacity
        } });
      }
    });

    worker.onmessage = ({ data }) => {
      if (data.type === 'progress') {
        this.store.dispatch(WatermarkActions.updateProgress({ progress: data.value }));
      } else if (data.type === 'complete') {
        this.store.dispatch(WatermarkActions.processingSuccess({ 
          outputBlob: data.data, 
          outputSizeMB: data.data.size / 1024 / 1024 
        }));
        worker.terminate();
        this.destroy$.next();
      } else if (data.type === 'error') {
        this.store.dispatch(WatermarkActions.processingFailure({ 
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
        a.download = `watermarked_video_${Date.now()}.mp4`;
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 150);
      }
    });
  }

  resetVideo() { this.store.dispatch(WatermarkActions.resetState()); }
  resetWatermark() { /* logic to clear watermark only if needed */ }
  reset() { this.store.dispatch(WatermarkActions.resetState()); }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
