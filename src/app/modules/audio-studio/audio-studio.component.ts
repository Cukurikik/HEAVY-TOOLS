import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ToolCardComponent, Tool } from '../../shared/components/tool-card/tool-card.component';

export const AUDIO_TOOLS: Tool[] = [
  { id: 'mastering',  label: 'Mastering Hub',    icon: 'graphic_eq',   category: 'pro',      status: 'stable' },
  { id: 'stem-split', label: 'AI Stem Splitter', icon: 'call_split',   category: 'ai',       status: 'beta' },
  { id: 'pitch',      label: 'Pitch Shift',      icon: 'tune',         category: 'advanced', status: 'stable' },
  { id: 'time',       label: 'Time Stretch',     icon: 'av_timer',     category: 'advanced', status: 'stable' },
  { id: 'export',     label: 'Audio Exporter',   icon: 'save_alt',     category: 'basic',    status: 'stable' },
  { id: 'noise',      label: 'Noise Reduction',  icon: 'hearing',      category: 'ai',       status: 'experimental' },
  { id: 'eq',         label: 'Parametric EQ',    icon: 'equalizer',    category: 'pro',      status: 'stable' },
  { id: 'compressor', label: 'Compressor',       icon: 'compress',     category: 'pro',      status: 'stable' },
];

@Component({
  selector: 'app-audio-studio',
  standalone: true,
  imports: [CommonModule, MatIconModule, ToolCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-8 space-y-8 max-w-7xl mx-auto">
      <header class="flex items-center justify-between mb-12">
        <div>
          <h1 class="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-accent-purple to-accent-pink mb-2">
            Audio Studio
          </h1>
          <p class="text-text-secondary">Zero-latency OfflineAudioContext rendering.</p>
        </div>
      </header>

      <section class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        @for (tool of audioTools; track tool.id) {
          <app-tool-card [tool]="tool" />
        }
      </section>
    </div>
  `
})
export class AudioStudioComponent {
  audioTools = AUDIO_TOOLS;
}
