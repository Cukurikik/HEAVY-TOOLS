import { ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy, signal, inject } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-audio-player',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-[#12121a] rounded-xl p-4 border border-white/5 space-y-3">
      <audio #audioEl [src]="blobUrl()" (timeupdate)="onTimeUpdate(audioEl)"
             (ended)="isPlaying.set(false)" (loadedmetadata)="totalTime.set(audioEl.duration)"></audio>
      <div class="flex items-center gap-4">
        <button class="w-10 h-10 rounded-full bg-cyan-500 text-black flex items-center justify-center hover:bg-cyan-400 transition-colors"
                (click)="togglePlay(audioEl)">
          {{ isPlaying() ? '⏸' : '▶' }}
        </button>
        <input type="range" class="flex-1 accent-cyan-400 h-1" min="0" [max]="totalTime()" step="0.1"
               [value]="currentTime()" (input)="onSeek(audioEl, $event)">
        <span class="text-white/50 text-xs font-mono min-w-[80px] text-right">
          {{ formatTime(currentTime()) }} / {{ formatTime(totalTime()) }}
        </span>
      </div>
    </div>
  `
})
export class AudioPlayerComponent implements OnChanges, OnDestroy {
  @Input() audioBlob: Blob | null = null;
  @Input() loop = false;
  private sanitizer = inject(DomSanitizer);
  blobUrl = signal<SafeUrl | null>(null);
  isPlaying = signal(false);
  currentTime = signal(0);
  totalTime = signal(0);
  private prevUrl = '';

  ngOnChanges(): void {
    if (this.prevUrl) URL.revokeObjectURL(this.prevUrl);
    if (this.audioBlob) {
      this.prevUrl = URL.createObjectURL(this.audioBlob);
      this.blobUrl.set(this.sanitizer.bypassSecurityTrustUrl(this.prevUrl));
    }
  }

  ngOnDestroy(): void { if (this.prevUrl) URL.revokeObjectURL(this.prevUrl); }

  togglePlay(el: HTMLAudioElement): void {
    if (el.paused) { el.play(); this.isPlaying.set(true); }
    else { el.pause(); this.isPlaying.set(false); }
  }

  onTimeUpdate(el: HTMLAudioElement): void { this.currentTime.set(el.currentTime); }

  onSeek(el: HTMLAudioElement, e: Event): void {
    const val = parseFloat((e.target as HTMLInputElement).value);
    el.currentTime = val; this.currentTime.set(val);
  }

  formatTime(sec: number): string {
    const m = Math.floor(sec / 60); const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }
}
