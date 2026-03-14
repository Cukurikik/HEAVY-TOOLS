import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-audio-progress-ring',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative inline-flex items-center justify-center p-3 bg-[#0a0a0f]/50 backdrop-blur-xl rounded-full border border-white/5 shadow-2xl transition-all duration-500 animate-fade-in-up">
      <!-- Background Glow -->
      <div class="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-full blur-md"></div>
      
      <svg [attr.width]="size" [attr.height]="size" class="-rotate-90 drop-shadow-[0_0_8px_rgba(34,211,238,0.3)] relative z-10 text">
        <circle [attr.cx]="size/2" [attr.cy]="size/2" [attr.r]="radius"
                fill="none" stroke="rgba(255,255,255,0.05)" [attr.stroke-width]="strokeWidth" />
        <circle [attr.cx]="size/2" [attr.cy]="size/2" [attr.r]="radius"
                fill="none" stroke="url(#audioGrad)" [attr.stroke-width]="strokeWidth"
                [attr.stroke-dasharray]="circumference"
                [attr.stroke-dashoffset]="circumference - (progress / 100) * circumference"
                stroke-linecap="round" class="transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]" />
        <defs>
          <linearGradient id="audioGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#22d3ee"/><stop offset="100%" stop-color="#a855f7"/>
          </linearGradient>
        </defs>
      </svg>
      <div class="absolute inset-0 flex items-center justify-center z-20">
        <span class="text-xs font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 drop-shadow-md tracking-tighter">{{ progress }}%</span>
      </div>
    </div>
  `
})
export class AudioProgressRingComponent {
  @Input() progress = 0;
  @Input() size = 64;
  @Input() strokeWidth = 4;
  get radius(): number { return (this.size - this.strokeWidth) / 2; }
  get circumference(): number { return 2 * Math.PI * this.radius; }
}
