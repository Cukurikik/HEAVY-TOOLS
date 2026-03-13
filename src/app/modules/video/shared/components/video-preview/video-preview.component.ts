// ============================================================
// VIDEO PREVIEW COMPONENT — HTML5 video player
// File: src/app/modules/video/shared/components/video-preview/video-preview.component.ts
// ============================================================

import {
  ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input,
  OnChanges, OnDestroy, Output, SimpleChanges, ViewChild, signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import type { VideoMeta } from '../../types/video.types';

@Component({
  selector: 'app-video-preview',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col gap-3">
      <div class="relative rounded-xl overflow-hidden bg-black/40 border border-white/10"
           [style.aspect-ratio]="'16/9'">
        @if (isLoading()) {
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        }
        <video
          #videoEl
          class="w-full h-full object-contain"
          [src]="objectUrl()"
          [controls]="showControls"
          [autoplay]="autoPlay"
          muted
          (loadedmetadata)="onMetadataLoad()"
          (seeked)="onSeeked()"
          (loadstart)="isLoading.set(true)"
          (canplay)="isLoading.set(false)"
        ></video>
      </div>

      @if (!showControls && objectUrl()) {
        <!-- Custom controls -->
        <div class="flex items-center gap-3">
          <button
            (click)="togglePlay()"
            class="w-8 h-8 flex items-center justify-center rounded-full bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-400 transition-colors"
          >
            @if (isPlaying()) {
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>
              </svg>
            } @else {
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <polygon points="5,3 19,12 5,21"/>
              </svg>
            }
          </button>
          <div class="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden cursor-pointer" (click)="seekBar($event)">
            <div class="h-full bg-cyan-400 rounded-full transition-all"
                 [style.width.%]="seekPercent()"></div>
          </div>
          <span class="text-xs text-white/50 tabular-nums">
            {{ formatTime(currentSeconds()) }} / {{ formatTime(duration()) }}
          </span>
        </div>
      }
    </div>
  `,
})
export class VideoPreviewComponent implements OnChanges, OnDestroy {
  @Input() file: File | null = null;
  @Input() currentTime = 0;
  @Input() showControls = true;
  @Input() autoPlay = false;

  @Output() durationDetected = new EventEmitter<number>();
  @Output() seeked = new EventEmitter<number>();
  @Output() metadataLoaded = new EventEmitter<VideoMeta>();

  @ViewChild('videoEl') videoEl!: ElementRef<HTMLVideoElement>;

  objectUrl = signal<string | null>(null);
  duration = signal(0);
  isLoading = signal(false);
  isPlaying = signal(false);
  currentSeconds = signal(0);
  seekPercent = signal(0);

  private _prevUrl: string | null = null;
  private _rafId: number | null = null;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['file'] && this.file) {
      if (this._prevUrl) URL.revokeObjectURL(this._prevUrl);
      const url = URL.createObjectURL(this.file);
      this._prevUrl = url;
      this.objectUrl.set(url);
      this.isLoading.set(true);
    }

    if (changes['currentTime'] && this.videoEl?.nativeElement) {
      this.videoEl.nativeElement.currentTime = this.currentTime;
    }
  }

  ngOnDestroy() {
    if (this._prevUrl) URL.revokeObjectURL(this._prevUrl);
    if (this._rafId !== null) cancelAnimationFrame(this._rafId);
    const el = this.videoEl?.nativeElement;
    if (el) el.pause();
  }

  onMetadataLoad() {
    const el = this.videoEl?.nativeElement;
    if (!el) return;
    this.duration.set(el.duration);
    this.durationDetected.emit(el.duration);
    this.startTimeTracking();
  }

  onSeeked() {
    this.seeked.emit(this.videoEl?.nativeElement.currentTime ?? 0);
  }

  togglePlay() {
    const el = this.videoEl?.nativeElement;
    if (!el) return;
    if (el.paused) { el.play(); this.isPlaying.set(true); }
    else { el.pause(); this.isPlaying.set(false); }
  }

  seekBar(event: MouseEvent) {
    const bar = event.currentTarget as HTMLElement;
    const ratio = event.offsetX / bar.clientWidth;
    const el = this.videoEl?.nativeElement;
    if (el && el.duration) {
      el.currentTime = ratio * el.duration;
    }
  }

  private startTimeTracking() {
    const track = () => {
      const el = this.videoEl?.nativeElement;
      if (el) {
        this.currentSeconds.set(el.currentTime);
        this.seekPercent.set(el.duration ? (el.currentTime / el.duration) * 100 : 0);
        this.isPlaying.set(!el.paused);
      }
      this._rafId = requestAnimationFrame(track);
    };
    this._rafId = requestAnimationFrame(track);
  }

  formatTime(s: number): string {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  }
}
