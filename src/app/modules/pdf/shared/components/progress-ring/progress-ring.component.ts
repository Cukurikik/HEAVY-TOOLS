import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-pdf-progress-ring',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative flex items-center justify-center">
      <svg class="transform -rotate-90" [style.width.px]="size" [style.height.px]="size">
        <circle
          class="text-white/10"
          stroke-width="8"
          stroke="currentColor"
          fill="transparent"
          [attr.r]="radius"
          [attr.cx]="size/2"
          [attr.cy]="size/2"
        />
        <circle
          class="text-cyan-500 transition-all duration-300 ease-out"
          stroke-width="8"
          [attr.stroke-dasharray]="circumference"
          [attr.stroke-dashoffset]="circumference - progress / 100 * circumference"
          stroke-linecap="round"
          stroke="currentColor"
          fill="transparent"
          [attr.r]="radius"
          [attr.cx]="size/2"
          [attr.cy]="size/2"
        />
      </svg>
      <div class="absolute inset-0 flex flex-col items-center justify-center">
        <span class="text-2xl font-bold text-white">{{ progress | number:'1.0-0' }}%</span>
        <span class="text-xs text-white/50 mt-1">{{ label }}</span>
      </div>
    </div>
  `
})
export class ProgressRingComponent {
  @Input() progress = 0;
  @Input() size = 120;
  @Input() label = 'Processing...';

  get radius() { return (this.size - 16) / 2; }
  get circumference() { return this.radius * 2 * Math.PI; }
}
