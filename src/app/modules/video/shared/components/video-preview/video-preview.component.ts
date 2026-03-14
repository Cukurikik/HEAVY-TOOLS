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
    <div class="flex flex-col gap-4 animate-fade-in-up">
      <div class="relative rounded-2xl overflow-hidden bg-[#050508] border border-white/10 shadow-2xl group transition-all duration-500 hover:border-white/20 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]" style="aspect-ratio:16/9">
        
        <!-- Loading State -->
        @if (isLoading()) {
          <div class="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0a0f]/80 backdrop-blur-md z-20">
            <div class="relative w-12 h-12 mb-3">
              <div class="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
              <div class="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
            </div>
            <span class="text-xs font-medium text-white/50 tracking-widest uppercase animate-pulse">Loading Engine</span>
          </div>
        }

        <!-- Video Element -->
        @if (objectUrl()) {
          <video #videoEl class="w-full h-full object-contain bg-black"
            [src]="objectUrl()" [controls]="showControls" [autoplay]="autoPlay" muted
            (loadedmetadata)="onMetadataLoad()"
            (loadstart)="isLoading.set(true)"
            (canplay)="isLoading.set(false)"
            crossorigin="anonymous">
          </video>
        }
        
        <!-- Overlay Gradient (only visible on pause or hover) -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10"></div>
      </div>
    </div>
  `
})
export class VideoPreviewComponent implements OnChanges, OnDestroy {
  @Input() file: File | null = null;
  @Input() currentTime = 0;
  @Input() showControls = true;
  @Input() autoPlay = false;
  @Output() durationDetected = new EventEmitter<number>();
  @Output() metadataLoaded = new EventEmitter<VideoMeta>();

  @ViewChild('videoEl') videoEl!: ElementRef<HTMLVideoElement>;

  objectUrl = signal<string | null>(null);
  isLoading = signal(false);
  private _prevUrl: string | null = null;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['file'] && this.file) {
      if (this._prevUrl) URL.revokeObjectURL(this._prevUrl);
      const url = URL.createObjectURL(this.file);
      this._prevUrl = url;
      this.objectUrl.set(url);
      this.isLoading.set(true);
    }
  }

  ngOnDestroy() {
    if (this._prevUrl) URL.revokeObjectURL(this._prevUrl);
  }

  onMetadataLoad() {
    const el = this.videoEl?.nativeElement;
    if (el) this.durationDetected.emit(el.duration);
    this.isLoading.set(false);
  }
}
