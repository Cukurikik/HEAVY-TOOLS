import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { cropResizeActions, cropResizeFeature } from './crop-resize.store';
import { CropResizeService } from './crop-resize.service';

@Component({
  selector: 'app-crop-resize',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="p-8 glass-panel rounded-2xl max-w-4xl mx-auto">
      <h2 class="text-3xl font-bold mb-4 flex items-center gap-2">
        <mat-icon class="text-accent-cyan">crop</mat-icon> Smart Crop & Resize
      </h2>
      <p class="text-text-secondary mb-8">Crop your video to any aspect ratio or resize dimensions.</p>

      @if ((state$ | async)?.file === null || (state$ | async)?.file === undefined) {
        <div (click)="fileInput.click()"
             (keyup.enter)="fileInput.click()"
             tabindex="0"
             role="button"
             class="aspect-video bg-black/40 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-white/20 hover:border-accent-cyan/50 transition-all cursor-pointer group">
          <mat-icon class="text-6xl text-text-muted group-hover:text-accent-cyan transition-colors mb-4">cloud_upload</mat-icon>
          <span class="text-text-muted group-hover:text-text-primary transition-colors">Click to upload video</span>
          <input #fileInput type="file" (change)="onFileSelected($event)" accept="video/*" class="hidden">
        </div>
      }

      @if ((state$ | async)?.file; as file) {
        <div class="space-y-6">
          <!-- File Info -->
          <div class="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-lg bg-accent-cyan/20 flex items-center justify-center">
                <mat-icon class="text-accent-cyan">movie</mat-icon>
              </div>
              <div>
                <h3 class="font-medium text-text-primary">{{ file.name }}</h3>
                <p class="text-sm text-text-muted">
                  {{ (state$ | async)?.meta?.width }}x{{ (state$ | async)?.meta?.height }} • 
                  {{ ((state$ | async)?.meta?.duration || 0) | number:'1.0-0' }}s • 
                  {{ (file.size / 1024 / 1024) | number:'1.1-1' }} MB
                </p>
              </div>
            </div>
            <button (click)="reset()" class="p-2 hover:bg-white/10 rounded-full text-text-muted hover:text-accent-red transition-all">
              <mat-icon>close</mat-icon>
            </button>
          </div>

          <!-- Controls -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="p-6 bg-white/5 rounded-xl border border-white/10 space-y-4">
              <h4 class="font-medium flex items-center gap-2">
                <mat-icon class="text-accent-cyan text-sm">aspect_ratio</mat-icon> Aspect Ratio Presets
              </h4>
              <div class="grid grid-cols-2 gap-2">
                <button (click)="setPreset('16:9')" class="py-2 rounded-lg border border-white/10 hover:bg-white/10 transition-all text-sm">16:9 (Landscape)</button>
                <button (click)="setPreset('9:16')" class="py-2 rounded-lg border border-white/10 hover:bg-white/10 transition-all text-sm">9:16 (Portrait)</button>
                <button (click)="setPreset('1:1')" class="py-2 rounded-lg border border-white/10 hover:bg-white/10 transition-all text-sm">1:1 (Square)</button>
                <button (click)="setPreset('4:5')" class="py-2 rounded-lg border border-white/10 hover:bg-white/10 transition-all text-sm">4:5 (Social)</button>
              </div>
            </div>

            <div class="p-6 bg-white/5 rounded-xl border border-white/10 space-y-4">
              <h4 class="font-medium flex items-center gap-2">
                <mat-icon class="text-accent-cyan text-sm">straighten</mat-icon> Custom Resize
              </h4>
              <div class="flex gap-4">
                <div class="flex-1 space-y-1">
                  <label [for]="'wInput-' + file.name" class="text-xs text-text-muted">Width</label>
                  <input type="number" [id]="'wInput-' + file.name" #wInput [value]="(state$ | async)?.resize?.width || (state$ | async)?.meta?.width" 
                         (input)="updateResize(wInput.value, hInput.value)"
                         class="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-accent-cyan outline-none">
                </div>
                <div class="flex-1 space-y-1">
                  <label [for]="'hInput-' + file.name" class="text-xs text-text-muted">Height</label>
                  <input type="number" [id]="'hInput-' + file.name" #hInput [value]="(state$ | async)?.resize?.height || (state$ | async)?.meta?.height"
                         (input)="updateResize(wInput.value, hInput.value)"
                         class="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-accent-cyan outline-none">
                </div>
              </div>
            </div>
          </div>

          <!-- Action -->
          <div class="flex flex-col gap-4">
            @if ((state$ | async)?.outputUrl === null || (state$ | async)?.outputUrl === undefined) {
              <button (click)="process()"
                      [disabled]="(state$ | async)?.isProcessing"
                      class="w-full py-4 bg-accent-cyan text-black font-bold rounded-xl hover:bg-accent-cyan/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2">
                @if ((state$ | async)?.isProcessing === false || (state$ | async)?.isProcessing === null || (state$ | async)?.isProcessing === undefined) {
                  <mat-icon>play_arrow</mat-icon>
                }
                @if ((state$ | async)?.isProcessing) {
                  <span class="animate-spin rounded-full h-5 w-5 border-2 border-black/20 border-t-black"></span>
                }
                {{ (state$ | async)?.isProcessing ? 'Processing...' : 'Apply Changes' }}
              </button>
            }

            @if ((state$ | async)?.isProcessing) {
              <div class="space-y-2">
                <div class="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div class="h-full bg-accent-cyan transition-all duration-300" [style.width.%]="(state$ | async)?.progress"></div>
                </div>
                <p class="text-center text-sm text-text-muted">Processing: {{ (state$ | async)?.progress }}%</p>
              </div>
            }

            @if ((state$ | async)?.outputUrl; as outputUrl) {
              <a [href]="outputUrl"
                 [download]="'cropped_' + file.name"
                 class="w-full py-4 bg-accent-green text-black font-bold rounded-xl hover:bg-accent-green/90 transition-all flex items-center justify-center gap-2">
                <mat-icon>download</mat-icon> Download Result
              </a>
            }
          </div>
        </div>
      }

      @if ((state$ | async)?.error; as error) {
        <div class="mt-6 p-4 bg-accent-red/20 border border-accent-red/50 rounded-xl text-accent-red flex items-center gap-3">
          <mat-icon>error</mat-icon>
          <span>{{ error }}</span>
        </div>
      }
    </div>
  `
})
export class CropResizeComponent {
  private store = inject(Store);
  private service = inject(CropResizeService);
  state$ = this.store.select(cropResizeFeature.selectCropResizeState);

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.store.dispatch(cropResizeActions.loadFile({ file }));
      // Mock meta data for now
      setTimeout(() => {
        this.store.dispatch(cropResizeActions.setMeta({
          meta: { duration: 120, size: file.size, name: file.name, width: 1920, height: 1080 }
        }));
      }, 500);
    }
  }

  setPreset(ratio: string) {
    this.state$.subscribe(state => {
      if (!state.meta) return;
      const { width, height } = state.meta;
      let targetW = width;
      let targetH = height;

      if (ratio === '16:9') {
        targetH = Math.round(width * 9 / 16);
      } else if (ratio === '9:16') {
        targetW = Math.round(height * 9 / 16);
      } else if (ratio === '1:1') {
        targetW = targetH = Math.min(width, height);
      } else if (ratio === '4:5') {
        targetW = Math.round(height * 4 / 5);
      }

      this.store.dispatch(cropResizeActions.setCrop({
        crop: {
          x: Math.max(0, Math.round((width - targetW) / 2)),
          y: Math.max(0, Math.round((height - targetH) / 2)),
          width: targetW,
          height: targetH
        }
      }));
    }).unsubscribe();
  }

  updateResize(w: string, h: string) {
    const width = parseInt(w);
    const height = parseInt(h);
    if (!isNaN(width) && !isNaN(height)) {
      this.store.dispatch(cropResizeActions.setResize({ resize: { width, height } }));
    }
  }

  process() {
    this.state$.subscribe(state => {
      if (!state.file) return;

      this.store.dispatch(cropResizeActions.startProcessing());

      const worker = new Worker(new URL('./crop-resize.worker', import.meta.url));
      worker.onmessage = ({ data }) => {
        if (data.type === 'progress') {
          this.store.dispatch(cropResizeActions.setProgress({ progress: data.value }));
        } else if (data.type === 'complete') {
          const url = URL.createObjectURL(data.data);
          this.store.dispatch(cropResizeActions.completeProcessing({ outputUrl: url }));
          worker.terminate();
        } else if (data.type === 'error') {
          this.store.dispatch(cropResizeActions.setError({ error: data.message }));
          worker.terminate();
        }
      };

      worker.postMessage({
        config: {
          inputFile: state.file,
          crop: state.crop,
          resize: state.resize
        }
      });
    }).unsubscribe();
  }

  reset() {
    this.store.dispatch(cropResizeActions.reset());
  }
}
