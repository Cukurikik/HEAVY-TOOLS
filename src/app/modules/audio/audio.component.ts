import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ToolCardComponent, Tool } from '../../shared/components/tool-card/tool-card.component';

export const AUDIO_TOOLS: Tool[] = [
  { id: 'recorder',    label: 'Audio Recorder',    icon: 'mic',          category: 'basic',    status: 'stable' },
  { id: 'trimmer',     label: 'Audio Trimmer',     icon: 'content_cut',  category: 'basic',    status: 'stable' },
  { id: 'merger',      label: 'Audio Merger',      icon: 'link',         category: 'basic',    status: 'stable' },
  { id: 'converter',   label: 'Format Converter', icon: 'sync',         category: 'basic',    status: 'stable' },
  { id: 'compressor',  label: 'Compressor',       icon: 'compress',     category: 'advanced', status: 'stable' },
  { id: 'equalizer',   label: 'Equalizer',        icon: 'equalizer',    category: 'advanced', status: 'stable' },
  { id: 'pitch-shifter', label: 'Pitch Shifter',  icon: 'height',       category: 'advanced', status: 'stable' },
  { id: 'time-stretch', label: 'Time Stretcher',  icon: 'slow_motion_video', category: 'advanced', status: 'stable' },
  { id: 'normalizer',  label: 'Normalizer',       icon: 'graphic_eq',   category: 'advanced', status: 'stable' },
  { id: 'reverb',      label: 'Reverb & Room',    icon: 'settings_input_antenna', category: 'pro', status: 'stable' },
  { id: 'noise-remover', label: 'Noise Remover',  icon: 'blur_off',     category: 'pro',      status: 'stable' },
  { id: 'splitter',    label: 'Audio Splitter',   icon: 'call_split',   category: 'advanced', status: 'stable' },
  { id: 'metadata',    label: 'Metadata Editor',  icon: 'info',         category: 'pro',      status: 'stable' },
  { id: 'batch',       label: 'Batch Processor',  icon: 'layers',       category: 'pro',      status: 'beta' },
  { id: 'analyser',    label: 'Audio Analyser',   icon: 'analytics',    category: 'advanced', status: 'stable' },
  { id: 'reverser',    label: 'Audio Reverser',   icon: 'fast_rewind',  category: 'basic',    status: 'stable' },
  { id: 'mixer',       label: 'Multi-track Mixer', icon: 'blur_linear',  category: 'pro',      status: 'beta' },
  { id: 'fade',        label: 'Fade In/Out',      icon: 'trending_flat', category: 'basic',    status: 'stable' },
  { id: 'looper',      label: 'Loop Creator',     icon: 'loop',         category: 'advanced', status: 'stable' },
  { id: 'channel-mixer', label: 'Channel Mixer',  icon: 'tune',         category: 'advanced', status: 'stable' },
  { id: 'silence-remover', label: 'Silence Remover', icon: 'volume_off', category: 'basic',    status: 'stable' },
  { id: 'speed',       label: 'Speed Changer',    icon: 'speed',        category: 'basic',    status: 'stable' },
  { id: 'limiter',     label: 'Limiter',          icon: 'vertical_align_bottom', category: 'pro', status: 'stable' },
  { id: 'stereo-widener', label: 'Stereo Widener', icon: 'settings_ethernet', category: 'advanced', status: 'stable' },
  { id: 'voice-changer', label: 'Voice Changer',  icon: 'record_voice_over', category: 'pro', status: 'beta' },
  { id: 'karaoke',     label: 'Vocal Remover',    icon: 'voice_over_off', category: 'ai',       status: 'experimental' },
  { id: 'visualizer',  label: 'Spectrum Visualizer', icon: 'waves',      category: 'pro',      status: 'stable' },
  { id: 'transcriber', label: 'Audio Transcriber', icon: 'description',  category: 'ai',       status: 'experimental' },
  { id: 'watermark',   label: 'Audio Watermark',  icon: 'branding_watermark', category: 'pro', status: 'stable' },
  { id: 'stem-splitter', label: 'AI Stem Splitter', icon: 'rocket_launch', category: 'ai',       status: 'experimental' },
];

@Component({
  selector: 'app-audio',
  standalone: true,
  imports: [CommonModule, MatIconModule, ToolCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-8 space-y-8 max-w-7xl mx-auto">
      <header class="flex items-center justify-between mb-12">
        <div>
          <h1 class="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-accent-purple mb-2">
            Audio Studio
          </h1>
          <p class="text-text-secondary">Professional audio processing in your browser. Zero server upload.</p>
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
export class AudioComponent {
  audioTools = AUDIO_TOOLS;
}
