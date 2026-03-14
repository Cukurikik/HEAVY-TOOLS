import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-audio-extractor',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="p-8 glass-panel rounded-2xl max-w-4xl mx-auto">
      <h2 class="text-3xl font-bold mb-4 flex items-center gap-2">
        <mat-icon class="text-accent-cyan">audiotrack</mat-icon> Audio Extractor
      </h2>
      <p class="text-text-secondary mb-8">Extract audio tracks from video files (MP3, AAC, FLAC).</p>
      <div class="aspect-video bg-black/40 rounded-xl flex items-center justify-center border border-dashed border-white/20">
        <span class="text-text-muted">Select video to extract audio</span>
      </div>
    </div>
  `
})
export class AudioExtractorComponent {}
