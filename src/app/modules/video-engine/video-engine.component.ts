import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ToolCardComponent, Tool } from '../../shared/components/tool-card/tool-card.component';

export const VIDEO_TOOLS: Tool[] = [
  { id: 'trim',       label: 'Video Trimmer',    icon: 'content_cut',  category: 'basic',    status: 'stable' },
  { id: 'merge',      label: 'Video Merger',     icon: 'link',         category: 'basic',    status: 'stable' },
  { id: 'convert',    label: 'Format Converter', icon: 'sync',         category: 'basic',    status: 'stable' },
  { id: 'compress',   label: 'Compressor',       icon: 'compress',     category: 'basic',    status: 'stable' },
  { id: 'stabilize',  label: 'Stabilizer',       icon: 'center_focus_strong', category: 'advanced', status: 'stable' },
  { id: 'reverse',    label: 'Reverse',          icon: 'fast_rewind',  category: 'advanced', status: 'stable' },
  { id: 'speed',      label: 'Speed Control',    icon: 'speed',        category: 'advanced', status: 'stable' },
  { id: 'loop',       label: 'Loop Engine',      icon: 'loop',         category: 'advanced', status: 'stable' },
  { id: 'flip',       label: 'Flip & Rotate',    icon: 'flip',         category: 'advanced', status: 'stable' },
  { id: 'crop',       label: 'Smart Crop',       icon: 'crop',         category: 'advanced', status: 'stable' },
  { id: 'pro-editor', label: 'Pro Editor',       icon: 'movie_creation', category: 'pro',      status: 'beta' },
  { id: 'color',      label: 'Color Grading',    icon: 'palette',      category: 'pro',      status: 'beta' },
  { id: 'subtitle',   label: 'Subtitle Burner',  icon: 'subtitles',    category: 'pro',      status: 'stable' },
  { id: 'thumbnail',  label: 'Thumbnail Gen',    icon: 'image',        category: 'pro',      status: 'stable' },
  { id: 'upscale',    label: 'AI Upscaler',      icon: 'rocket_launch', category: 'ai',       status: 'experimental' },
  { id: 'denoise',    label: 'AI Denoiser',      icon: 'auto_awesome', category: 'ai',       status: 'experimental' },
];

@Component({
  selector: 'app-video-engine',
  standalone: true,
  imports: [CommonModule, MatIconModule, ToolCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-8 space-y-8 max-w-7xl mx-auto">
      <header class="flex items-center justify-between mb-12">
        <div>
          <h1 class="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-accent-purple mb-2">
            Video Engine
          </h1>
          <p class="text-text-secondary">WASM-powered video processing. Zero server upload required.</p>
        </div>
        <div class="hidden md:flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
          <button class="px-4 py-2 rounded-lg text-sm font-medium bg-white/10 text-white shadow-sm">All</button>
          <button class="px-4 py-2 rounded-lg text-sm font-medium text-text-secondary hover:text-white hover:bg-white/5 transition-colors">Basic</button>
          <button class="px-4 py-2 rounded-lg text-sm font-medium text-text-secondary hover:text-white hover:bg-white/5 transition-colors">Advanced</button>
          <button class="px-4 py-2 rounded-lg text-sm font-medium text-text-secondary hover:text-white hover:bg-white/5 transition-colors">AI</button>
        </div>
      </header>

      <section class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        @for (tool of videoTools; track tool.id) {
          <app-tool-card [tool]="tool" />
        }
      </section>
    </div>
  `
})
export class VideoEngineComponent {
  videoTools = VIDEO_TOOLS;
}
