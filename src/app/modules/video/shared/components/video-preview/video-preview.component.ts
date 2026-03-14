import {
  ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input,
  OnChanges, OnDestroy, Output, SimpleChanges, ViewChild, signal, inject
} from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import type { VideoMeta } from '../../types/video.types';

@Component({
  selector: 'app-video-preview',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col gap-3">
      <div class="relative rounded-xl overflow-hidden bg-black/40 border border-white/10" style="aspect-ratio:16/9">
        @if (isLoading()) {
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        }
        @if (objectUrl()) {
          <video #videoEl class="w-full h-full object-contain"
            [src]="objectUrl()" [controls]="showControls" [autoplay]="autoPlay" muted
            (loadedmetadata)="onMetadataLoad()"
            (loadstart)="isLoading.set(true)"
            (canplay)="isLoading.set(false)">
          </video>
        }
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

  private sanitizer = inject(DomSanitizer);

  objectUrl = signal<SafeUrl | null>(null);
  isLoading = signal(false);
  private _prevUrl: string | null = null;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['file'] && this.file) {
      if (this._prevUrl) URL.revokeObjectURL(this._prevUrl);
      const url = URL.createObjectURL(this.file);
      this._prevUrl = url;
      this.objectUrl.set(this.sanitizer.bypassSecurityTrustUrl(url));
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
