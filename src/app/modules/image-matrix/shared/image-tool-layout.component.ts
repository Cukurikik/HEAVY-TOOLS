// ============================================================
// IMAGE TOOL LAYOUT — Shared two-panel layout for image tools
// File: src/app/modules/image-matrix/shared/image-tool-layout.component.ts
// ============================================================

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-image-tool-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen p-4 md:p-8 max-w-[1600px] mx-auto">
      <!-- Back Button + Header -->
      <div class="mb-8">
        <a routerLink="/image"
           class="inline-flex items-center gap-2 text-sm text-white/50 hover:text-cyan-400 transition-colors mb-4 group">
          <mat-icon class="text-lg group-hover:-translate-x-1 transition-transform">arrow_back</mat-icon>
          Back to Image Matrix
        </a>
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
               [ngClass]="gradientClass || 'bg-gradient-to-br from-cyan-500/20 to-purple-500/20'">
            {{ emoji }}
          </div>
          <div>
            <h1 class="text-3xl md:text-4xl font-bold tracking-tight text-transparent bg-clip-text"
                [ngClass]="headerGradient || 'bg-gradient-to-r from-cyan-400 to-purple-400'">
              {{ title }}
            </h1>
            <p class="text-white/50 text-sm mt-1">{{ description }}</p>
          </div>
        </div>
      </div>

      <!-- Two Panel Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Left Panel: Controls -->
        <div class="space-y-4">
          <div class="glass-panel rounded-2xl p-6 border border-white/10">
            <ng-content select="[leftPanel]"></ng-content>
          </div>
        </div>

        <!-- Right Panel: Preview / Output -->
        <div class="space-y-4">
          <div class="glass-panel rounded-2xl p-6 border border-white/10">
            <ng-content select="[rightPanel]"></ng-content>
          </div>
        </div>
      </div>

      <!-- Full Width Bottom Section (optional) -->
      <ng-content select="[bottomPanel]"></ng-content>
    </div>
  `
})
export class ImageToolLayoutComponent {
  @Input() title = 'Image Tool';
  @Input() description = '';
  @Input() emoji = '🖼️';
  @Input() gradientClass = '';
  @Input() headerGradient = '';
}
