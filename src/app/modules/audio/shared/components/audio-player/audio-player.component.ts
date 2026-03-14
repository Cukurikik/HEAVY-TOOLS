import { ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-audio-player',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="group bg-[#0a0a0f]/80 backdrop-blur-xl rounded-2xl p-5 border border-white/10 shadow-lg hover:border-white/20 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] transition-all duration-300 space-y-4 animate-fade-in-up">
      <audio #audioEl [src]="blobUrl()" (timeupdate)="onTimeUpdate(audioEl)"
             (ended)="isPlaying.set(false)" (loadedmetadata)="totalTime.set(audioEl.duration)"></audio>
             
      <div class="flex flex-col gap-3">
        <!-- Progress Bar (Range Input Customization) -->
        <div class="relative w-full h-2 bg-white/5 rounded-full overflow-hidden group/slider cursor-pointer">
          <input type="range" 
                 class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" 
                 min="0" [max]="totalTime()" step="0.1" [value]="currentTime()" 
                 (input)="onSeek(audioEl, $event)">
          <div class="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full z-10 pointers-events-none group-hover/slider:shadow-[0_0_10px_rgba(34,211,238,0.8)] transition-all"
               [style.width.%]="totalTime() > 0 ? (currentTime() / totalTime()) * 100 : 0"></div>
        </div>

        <div class="flex items-center justify-between">
          <button class="relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 group/btn"
                  (click)="togglePlay(audioEl)">
             <div class="absolute inset-0 bg-cyan-500/20 rounded-full blur-md group-hover/btn:bg-cyan-500/40 group-hover/btn:scale-110 transition-all duration-300"></div>
             <div class="relative w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 text-black rounded-full flex items-center justify-center group-hover/btn:scale-105 shadow-md">
                <span class="text-lg translate-x-[1px] font-black">{{ isPlaying() ? '⏸' : '▶' }}</span>
             </div>
          </button>
          
          <div class="flex items-baseline gap-1 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
            <span class="text-cyan-400 font-mono text-sm tracking-widest font-bold drop-shadow-sm">{{ formatTime(currentTime()) }}</span>
            <span class="text-white/30 text-xs mx-1">/</span>
            <span class="text-white/50 font-mono text-xs tracking-wider">{{ formatTime(totalTime()) }}</span>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AudioPlayerComponent implements OnChanges, OnDestroy {
  @Input() audioBlob: Blob | null = null;
  @Input() loop = false;
  blobUrl = signal('');
  isPlaying = signal(false);
  currentTime = signal(0);
  totalTime = signal(0);
  private prevUrl = '';

  ngOnChanges(): void {
    if (this.prevUrl) URL.revokeObjectURL(this.prevUrl);
    if (this.audioBlob) {
      this.prevUrl = URL.createObjectURL(this.audioBlob);
      this.blobUrl.set(this.prevUrl);
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
