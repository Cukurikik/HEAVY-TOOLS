import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-blur',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="p-8 glass-panel rounded-2xl max-w-4xl mx-auto">
      <h2 class="text-3xl font-bold mb-4 flex items-center gap-2">
        <mat-icon class="text-accent-cyan">blur_on</mat-icon> Video Blur
      </h2>
      <p class="text-text-secondary mb-8">Apply blur effects to specific areas or the entire video.</p>
      <div class="aspect-video bg-black/40 rounded-xl flex items-center justify-center border border-dashed border-white/20">
        <span class="text-text-muted">Select video to blur</span>
      </div>
    </div>
  `
})
export class BlurComponent {}
