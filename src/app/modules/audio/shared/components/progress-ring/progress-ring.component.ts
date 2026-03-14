import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-audio-progress-ring',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative inline-flex items-center justify-center">
      <svg [attr.width]="size" [attr.height]="size" class="-rotate-90">
        <circle [attr.cx]="size/2" [attr.cy]="size/2" [attr.r]="radius"
                fill="none" stroke="rgba(255,255,255,0.05)" [attr.stroke-width]="strokeWidth" />
        <circle [attr.cx]="size/2" [attr.cy]="size/2" [attr.r]="radius"
                fill="none" stroke="url(#audioGrad)" [attr.stroke-width]="strokeWidth"
                [attr.stroke-dasharray]="circumference"
                [attr.stroke-dashoffset]="circumference - (progress / 100) * circumference"
                stroke-linecap="round" class="transition-all duration-300" />
        <defs><linearGradient id="audioGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#22d3ee"/><stop offset="100%" stop-color="#a855f7"/>
        </linearGradient></defs>
      </svg>
      <span class="absolute text-xs font-bold text-white/80">{{ progress }}%</span>
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
