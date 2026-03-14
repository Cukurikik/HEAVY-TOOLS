import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-batch',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="p-8 glass-panel rounded-2xl max-w-4xl mx-auto">
      <h2 class="text-3xl font-bold mb-4 flex items-center gap-2">
        <mat-icon class="text-accent-cyan">layers</mat-icon> Batch Processor
      </h2>
      <p class="text-text-secondary mb-8">Apply the same operation to multiple videos at once.</p>
      <div class="aspect-video bg-black/40 rounded-xl flex items-center justify-center border border-dashed border-white/20">
        <span class="text-text-muted">Select multiple videos for batch processing</span>
      </div>
    </div>
  `
})
export class BatchComponent {}
