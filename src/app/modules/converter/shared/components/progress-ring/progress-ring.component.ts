// ============================================================
// PROGRESS RING COMPONENT — SVG circular progress indicator
// File: src/app/modules/converter/shared/components/progress-ring/progress-ring.component.ts
// ============================================================

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-converter-progress-ring',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative inline-flex items-center justify-center">
      <svg [attr.width]="size" [attr.height]="size" class="-rotate-90">
        <!-- Background circle -->
        <circle
          [attr.cx]="size / 2" [attr.cy]="size / 2" [attr.r]="radius"
          fill="none" stroke="rgba(255,255,255,0.08)" [attr.stroke-width]="strokeWidth" />
        <!-- Progress circle -->
        <circle
          [attr.cx]="size / 2" [attr.cy]="size / 2" [attr.r]="radius"
          fill="none" stroke="url(#converter-progress-gradient)" [attr.stroke-width]="strokeWidth"
          stroke-linecap="round"
          [attr.stroke-dasharray]="circumference"
          [attr.stroke-dashoffset]="dashOffset"
          class="transition-[stroke-dashoffset] duration-300 ease-out" />
        <defs>
          <linearGradient id="converter-progress-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#00f5ff" />
            <stop offset="100%" stop-color="#a855f7" />
          </linearGradient>
        </defs>
      </svg>
      <div class="absolute flex flex-col items-center">
        <span class="text-xl font-bold text-white">{{ progress }}%</span>
        @if (label) {
          <span class="text-[10px] text-white/40 mt-0.5">{{ label }}</span>
        }
      </div>
    </div>
  ` })
export class ConverterProgressRingComponent {
  @Input() progress = 0;
  @Input() label = '';
  @Input() size = 120;
  @Input() strokeWidth = 8;

  get radius(): number {
    return (this.size - this.strokeWidth) / 2;
  }

  get circumference(): number {
    return 2 * Math.PI * this.radius;
  }

  get dashOffset(): number {
    return this.circumference * (1 - Math.min(100, Math.max(0, this.progress)) / 100);
  }
}
