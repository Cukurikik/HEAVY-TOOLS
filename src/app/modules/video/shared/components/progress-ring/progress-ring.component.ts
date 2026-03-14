import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-progress-ring',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col items-center gap-2">
      <svg [attr.width]="size" [attr.height]="size" viewBox="0 0 100 100">
        <circle cx="50" cy="50" [attr.r]="radius" fill="none" stroke="rgba(255,255,255,0.08)" [attr.stroke-width]="strokeWidth"/>
        <circle cx="50" cy="50" [attr.r]="radius" fill="none" [attr.stroke]="color" [attr.stroke-width]="strokeWidth"
          stroke-linecap="round" [attr.stroke-dasharray]="circumference" [attr.stroke-dashoffset]="dashOffset"
          transform="rotate(-90 50 50)" style="transition: stroke-dashoffset 0.4s ease"
          [style.filter]="'drop-shadow(0 0 6px ' + color + ')'"/>
        <text x="50" y="50" text-anchor="middle" dominant-baseline="central"
          fill="white" font-size="18" font-weight="700" font-family="monospace">{{ progress }}%</text>
      </svg>
      @if (label) { <p class="text-xs text-white/60 text-center">{{ label }}</p> }
    </div>
  `
})
export class ProgressRingComponent {
  @Input() progress = 0;
  @Input() size = 80;
  @Input() strokeWidth = 6;
  @Input() color = '#00f5ff';
  @Input() label = '';
  get radius() { return (100 - this.strokeWidth * 2) / 2; }
  get circumference() { return 2 * Math.PI * this.radius; }
  get dashOffset() { return this.circumference * (1 - this.progress / 100); }
}
