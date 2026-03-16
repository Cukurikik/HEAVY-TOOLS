import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-video-tool-layout',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-[#0a0a0f] p-6 space-y-6">
      <header class="space-y-1">
        <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r" [ngClass]="gradientClass">
          {{ title }}
        </h1>
        <p class="text-white/50 text-sm">{{ description }}</p>
      </header>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <ng-content select="[leftPanel]"></ng-content>
        </div>
        <div class="space-y-4">
          <ng-content select="[rightPanel]"></ng-content>
        </div>
      </div>
    </div>
  `
})
export class VideoToolLayoutComponent {
  @Input() title = '';
  @Input() description = '';
  @Input() gradientClass = 'from-cyan-400 to-blue-400';
}
