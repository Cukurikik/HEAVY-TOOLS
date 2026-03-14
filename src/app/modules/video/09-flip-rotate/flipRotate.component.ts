import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { flipRotateActions, flipRotateFeature } from './flip-rotate.store';
import { FlipRotateService } from './flip-rotate.service';

@Component({
  selector: 'app-flip-rotate',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="p-8 glass-panel rounded-2xl max-w-4xl mx-auto">
      <h2 class="text-3xl font-bold mb-4 flex items-center gap-2">
        <mat-icon class="text-accent-cyan">flip</mat-icon> Flip & Rotate
      </h2>
      <p class="text-text-secondary mb-8">Flip horizontally/vertically or rotate your video.</p>

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
                <p class="text-sm text-text-muted">{{ ((state$ | async)?.meta?.duration || 0) | number:'1.0-0' }}s • {{ (file.size / 1024 / 1024) | number:'1.1-1' }} MB</p>
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
                <mat-icon class="text-accent-cyan text-sm">flip</mat-icon> Flip Options
              </h4>
              <div class="flex gap-4">
                <button (click)="toggleFlipH()" 
                        [class.bg-accent-cyan]="(state$ | async)?.flipH"
                        [class.text-black]="(state$ | async)?.flipH"
                        class="flex-1 py-3 rounded-lg border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                  <mat-icon>swap_horiz</mat-icon> Horizontal
                </button>
                <button (click)="toggleFlipV()" 
                        [class.bg-accent-cyan]="(state$ | async)?.flipV"
                        [class.text-black]="(state$ | async)?.flipV"
                        class="flex-1 py-3 rounded-lg border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                  <mat-icon>swap_vert</mat-icon> Vertical
                </button>
              </div>
            </div>

            <div class="p-6 bg-white/5 rounded-xl border border-white/10 space-y-4">
              <h4 class="font-medium flex items-center gap-2">
                <mat-icon class="text-accent-cyan text-sm">rotate_right</mat-icon> Rotation
              </h4>
              <div class="grid grid-cols-4 gap-2">
                @for (rot of [0, 90, 180, 270]; track rot) {
                  <button (click)="setRotation(rot)"
                          [class.bg-accent-cyan]="(state$ | async)?.rotation === rot"
                          [class.text-black]="(state$ | async)?.rotation === rot"
                          class="py-2 rounded-lg border border-white/10 hover:bg-white/10 transition-all text-sm">
                    {{ rot }}°
                  </button>
                }
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
                 [download]="'flipped_' + file.name"
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
export class FlipRotateComponent {
  private store = inject(Store);
  private service = inject(FlipRotateService);
  state$ = this.store.select(flipRotateFeature.selectFlipRotateState);

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.store.dispatch(flipRotateActions.loadFile({ file }));
      // Mock meta data for now
      setTimeout(() => {
        this.store.dispatch(flipRotateActions.setMeta({
          meta: { duration: 120, size: file.size, name: file.name }
        }));
      }, 500);
    }
  }

  toggleFlipH() {
    this.state$.subscribe(state => {
      this.store.dispatch(flipRotateActions.setFlipH({ flipH: !state.flipH }));
    }).unsubscribe();
  }

  toggleFlipV() {
    this.state$.subscribe(state => {
      this.store.dispatch(flipRotateActions.setFlipV({ flipV: !state.flipV }));
    }).unsubscribe();
  }

  setRotation(rotation: number) {
    this.store.dispatch(flipRotateActions.setRotation({ rotation: rotation as 0 | 90 | 180 | 270 }));
  }

  process() {
    this.state$.subscribe(state => {
      if (!state.file) return;

      this.store.dispatch(flipRotateActions.startProcessing());

      const worker = new Worker(new URL('./flip-rotate.worker', import.meta.url));
      worker.onmessage = ({ data }) => {
        if (data.type === 'progress') {
          this.store.dispatch(flipRotateActions.setProgress({ progress: data.value }));
        } else if (data.type === 'complete') {
          const url = URL.createObjectURL(data.data);
          this.store.dispatch(flipRotateActions.completeProcessing({ outputUrl: url }));
          worker.terminate();
        } else if (data.type === 'error') {
          this.store.dispatch(flipRotateActions.setError({ error: data.message }));
          worker.terminate();
        }
      };

      worker.postMessage({
        config: {
          inputFile: state.file,
          flipH: state.flipH,
          flipV: state.flipV,
          rotation: state.rotation
        }
      });
    }).unsubscribe();
  }

  reset() {
    this.store.dispatch(flipRotateActions.reset());
  }
}
