import { ChangeDetectionStrategy, Component, output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { selectSidebarCollapsed, selectActiveRoute } from '../../store/app.selectors';
import { toggleSidebar } from '../../store/app.actions';

export interface NavItem {
  label: string;
  icon: string;
  route: string;
  badge: string | null;
  children?: NavChild[];
}

export interface NavChild {
  label: string;
  emoji: string;
  route: string;
  category: 'basic' | 'advanced' | 'pro' | 'ai';
}

/** 30 Video sub-links matching video.routes.ts paths */
export const VIDEO_CHILDREN: NavChild[] = [
  // ── Basic ──
  { label: 'Trimmer',           emoji: '✂️',  route: '/video/trimmer',         category: 'basic' },
  { label: 'Merger',            emoji: '🔗',  route: '/video/merger',          category: 'basic' },
  { label: 'Converter',         emoji: '🔄',  route: '/video/converter',       category: 'basic' },
  { label: 'Compressor',        emoji: '📦',  route: '/video/compressor',      category: 'basic' },
  { label: 'To GIF',            emoji: '🎞️', route: '/video/to-gif',          category: 'basic' },
  // ── Advanced ──
  { label: 'Stabilizer',        emoji: '🤝',  route: '/video/stabilizer',      category: 'advanced' },
  { label: 'Reverser',          emoji: '⏪',  route: '/video/reverser',        category: 'advanced' },
  { label: 'Speed Control',     emoji: '⚡',  route: '/video/speed',           category: 'advanced' },
  { label: 'Looper',            emoji: '🔁',  route: '/video/looper',          category: 'advanced' },
  { label: 'Flip & Rotate',     emoji: '🔃',  route: '/video/flip-rotate',     category: 'advanced' },
  { label: 'Crop & Resize',     emoji: '📐',  route: '/video/crop-resize',     category: 'advanced' },
  { label: 'Denoiser',          emoji: '🧹',  route: '/video/denoiser',        category: 'advanced' },
  { label: 'Interpolator',      emoji: '🎞️', route: '/video/interpolate',     category: 'advanced' },
  { label: 'Splitter',          emoji: '🔪',  route: '/video/splitter',        category: 'advanced' },
  { label: 'PiP',               emoji: '📺',  route: '/video/pip',             category: 'advanced' },
  { label: 'Blur',              emoji: '🌫️', route: '/video/blur',            category: 'advanced' },
  { label: 'Compare',           emoji: '⚖️',  route: '/video/compare',         category: 'advanced' },
  { label: 'Analyser',          emoji: '📊',  route: '/video/analyser',        category: 'advanced' },
  // ── Pro ──
  { label: 'Color Grading',     emoji: '🎨',  route: '/video/color-grading',   category: 'pro' },
  { label: 'Subtitles',         emoji: '💬',  route: '/video/subtitles',       category: 'pro' },
  { label: 'Thumbnails',        emoji: '🖼️', route: '/video/thumbnail',       category: 'pro' },
  { label: 'Watermark',         emoji: '💧',  route: '/video/watermark',       category: 'pro' },
  { label: 'Extract Audio',     emoji: '🎵',  route: '/video/extract-audio',   category: 'pro' },
  { label: 'Replace Audio',     emoji: '🔊',  route: '/video/replace-audio',   category: 'pro' },
  { label: 'Metadata',          emoji: '📝',  route: '/video/metadata',        category: 'pro' },
  { label: 'Screen Recorder',   emoji: '🖥️', route: '/video/screen-recorder', category: 'pro' },
  { label: 'Transitions',       emoji: '✨',  route: '/video/transitions',     category: 'pro' },
  { label: 'Slideshow',         emoji: '🎬',  route: '/video/slideshow',       category: 'pro' },
  { label: 'Batch Processor',   emoji: '⚙️',  route: '/video/batch',           category: 'pro' },
  // ── AI ──
  { label: 'AI Upscaler',       emoji: '🚀',  route: '/video/upscaler',        category: 'ai' },
];

/** 30 Audio sub-links matching audio.routes.ts paths */
export const AUDIO_CHILDREN: NavChild[] = [
  // Basic
  { label: 'Recorder',        emoji: '🎙️', route: '/audio/recorder',        category: 'basic' },
  { label: 'Trimmer',         emoji: '✂️',  route: '/audio/trimmer',         category: 'basic' },
  { label: 'Merger',          emoji: '🔗',  route: '/audio/merger',          category: 'basic' },
  { label: 'Converter',       emoji: '🔄',  route: '/audio/converter',       category: 'basic' },
  { label: 'Reverser',        emoji: '⏪',  route: '/audio/reverser',        category: 'basic' },
  { label: 'Fade In/Out',     emoji: '🌅',  route: '/audio/fade',            category: 'basic' },
  { label: 'Silence Remover', emoji: '🔇',  route: '/audio/silence-remover', category: 'basic' },
  { label: 'Speed Changer',   emoji: '⚡',  route: '/audio/speed',           category: 'basic' },
  // Advanced
  { label: 'Compressor',      emoji: '🔊',  route: '/audio/compressor',      category: 'advanced' },
  { label: 'Equalizer',       emoji: '🎛️', route: '/audio/equalizer',       category: 'advanced' },
  { label: 'Pitch Shifter',   emoji: '🎵',  route: '/audio/pitch-shifter',   category: 'advanced' },
  { label: 'Time Stretch',    emoji: '⏱️', route: '/audio/time-stretch',    category: 'advanced' },
  { label: 'Normalizer',      emoji: '📏',  route: '/audio/normalizer',      category: 'advanced' },
  { label: 'Splitter',        emoji: '🔪',  route: '/audio/splitter',        category: 'advanced' },
  { label: 'Analyser',        emoji: '📊',  route: '/audio/analyser',        category: 'advanced' },
  { label: 'Looper',          emoji: '🔁',  route: '/audio/looper',          category: 'advanced' },
  { label: 'Channel Mixer',   emoji: '🔀',  route: '/audio/channel-mixer',   category: 'advanced' },
  { label: 'Stereo Widener',  emoji: '📡',  route: '/audio/stereo-widener',  category: 'advanced' },
  // Pro
  { label: 'Reverb',          emoji: '🏛️', route: '/audio/reverb',          category: 'pro' },
  { label: 'Noise Remover',   emoji: '🧹',  route: '/audio/noise-remover',   category: 'pro' },
  { label: 'Metadata',        emoji: '📝',  route: '/audio/metadata',        category: 'pro' },
  { label: 'Batch',           emoji: '⚙️',  route: '/audio/batch',           category: 'pro' },
  { label: 'Mixer',           emoji: '🎚️', route: '/audio/mixer',           category: 'pro' },
  { label: 'Limiter',         emoji: '🚧',  route: '/audio/limiter',         category: 'pro' },
  { label: 'Voice Changer',   emoji: '🎭',  route: '/audio/voice-changer',   category: 'pro' },
  { label: 'Visualizer',      emoji: '🌈',  route: '/audio/visualizer',      category: 'pro' },
  { label: 'Watermark',       emoji: '💧',  route: '/audio/watermark',       category: 'pro' },
  // AI
  { label: 'Karaoke',         emoji: '🎤',  route: '/audio/karaoke',         category: 'ai' },
  { label: 'Transcriber',     emoji: '📜',  route: '/audio/transcriber',     category: 'ai' },
  { label: 'Stem Splitter',   emoji: '🧬',  route: '/audio/stem-splitter',   category: 'ai' },
];

/** 30 PDF sub-links matching pdf.routes.ts paths */
export const PDF_CHILDREN: NavChild[] = [
  // Basic
  { label: 'Merger',          emoji: '🔗',  route: '/pdf/merger',          category: 'basic' },
  { label: 'Splitter',        emoji: '✂️',  route: '/pdf/splitter',        category: 'basic' },
  { label: 'Compressor',      emoji: '🗜️',  route: '/pdf/compressor',      category: 'basic' },
  { label: 'Converter',       emoji: '🔄',  route: '/pdf/converter',       category: 'basic' },
  { label: 'Page Rotator',    emoji: '🔄',  route: '/pdf/rotator',         category: 'basic' },
  { label: 'Crop / Resize',   emoji: '📐',  route: '/pdf/crop-resize',     category: 'basic' },
  
  // Advanced
  { label: 'Metadata Editor', emoji: '📋',  route: '/pdf/metadata-editor', category: 'advanced' },
  { label: 'Digital Signer',  emoji: '✍️',  route: '/pdf/digital-signer',  category: 'advanced' },
  { label: 'Redactor',        emoji: '⬛',  route: '/pdf/redactor',        category: 'advanced' },
  { label: 'Annotator',       emoji: '🖍️',  route: '/pdf/annotator',       category: 'advanced' },
  { label: 'Form Filler',     emoji: '📄',  route: '/pdf/form-filler',     category: 'advanced' },
  { label: 'Page Reorderer',  emoji: '📑',  route: '/pdf/page-reorderer',  category: 'advanced' },
  { label: 'Thumbnails',      emoji: '📸',  route: '/pdf/thumbnail-generator', category: 'advanced' },
  { label: 'Compare',         emoji: '⚖️',  route: '/pdf/compare',         category: 'advanced' },
  { label: 'Bookmark Editor', emoji: '🔖',  route: '/pdf/bookmark-editor', category: 'advanced' },
  { label: 'Batch Processor', emoji: '⚙️',  route: '/pdf/batch-processor', category: 'advanced' },
  { label: 'Flattener',       emoji: '🥞',  route: '/pdf/flattener',       category: 'advanced' },
  { label: 'Optimizer',       emoji: '⚡',  route: '/pdf/optimizer',       category: 'advanced' },
  { label: 'Repair',          emoji: '🛠️',  route: '/pdf/repair',          category: 'advanced' },

  // Pro 
  { label: 'Text Extractor',  emoji: '📝',  route: '/pdf/text-extractor',  category: 'pro' },
  { label: 'Image Extractor', emoji: '🖼️',  route: '/pdf/image-extractor', category: 'pro' },
  { label: 'Password Protect',emoji: '🔒',  route: '/pdf/password-protector', category: 'pro' },
  { label: 'Unlocker',        emoji: '🔓',  route: '/pdf/unlocker',        category: 'pro' },
  { label: 'Watermark',       emoji: '💧',  route: '/pdf/watermark',       category: 'pro' },
  { label: 'To Word',         emoji: '📝',  route: '/pdf/to-word',         category: 'pro' },
  { label: 'To Excel',        emoji: '📊',  route: '/pdf/to-excel',        category: 'pro' },
  { label: 'To PPT',          emoji: '📽️',  route: '/pdf/to-powerpoint',   category: 'pro' },
  { label: 'To HTML',         emoji: '🌐',  route: '/pdf/to-html',         category: 'pro' },
  { label: 'To Image Batch',  emoji: '🔢',  route: '/pdf/to-image-batch',  category: 'pro' },

  // AI
  { label: 'OCR',             emoji: '🔍',  route: '/pdf/ocr',             category: 'ai' },
];

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard',    icon: 'grid_view',   route: '/',          badge: null },
  { label: 'Video Engine', icon: 'movie',        route: '/video',     badge: '30', children: VIDEO_CHILDREN },
  { label: 'Audio Studio', icon: 'music_note',   route: '/audio',     badge: '30', children: AUDIO_CHILDREN },
  { label: 'PDF Tools',    icon: 'picture_as_pdf', route: '/pdf',     badge: '30', children: PDF_CHILDREN },
  { label: 'Image Matrix', icon: 'image',        route: '/image',     badge: '10+' },
  { label: 'Converter',    icon: 'sync',         route: '/converter', badge: 'NEW' },
  { label: 'Settings',     icon: 'settings',     route: '/settings',  badge: null },
];

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <aside class="h-screen glass-panel border-r border-white/10 flex flex-col transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]"
           [class.w-[260px]]="(collapsed$ | async) === false"
           [class.w-[72px]]="collapsed$ | async">
      
      <!-- Header -->
      <div class="h-16 flex items-center justify-between px-4 border-b border-white/10">
        <div class="flex items-center gap-3 overflow-hidden whitespace-nowrap" [class.opacity-0]="collapsed$ | async" [class.w-0]="collapsed$ | async">
          <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center shadow-glow">
            <mat-icon class="text-white text-xl">all_inclusive</mat-icon>
          </div>
          <span class="font-bold text-lg tracking-tight">Omni-Tool</span>
        </div>
        <button class="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors text-text-secondary hover:text-white shrink-0"
                (click)="onToggleCollapse()">
          <mat-icon>{{ (collapsed$ | async) ? 'menu' : 'menu_open' }}</mat-icon>
        </button>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 py-4 px-3 space-y-1 overflow-y-auto overflow-x-hidden scrollbar-thin">
        @for (item of navItems; track item.route) {
          <!-- Parent Nav Item -->
          <div>
            <a [routerLink]="item.children ? null : item.route"
               (click)="item.children ? toggleExpand(item.route) : null"
               routerLinkActive="bg-white/10 text-white shadow-[inset_4px_0_0_0_#00f5ff]"
               [routerLinkActiveOptions]="{exact: item.route === '/'}"
               class="flex items-center gap-4 px-3 py-3 rounded-xl text-text-secondary hover:text-white hover:bg-white/5 transition-all duration-300 group relative cursor-pointer"
               [title]="(collapsed$ | async) ? item.label : ''">
              
              <mat-icon class="shrink-0 transition-transform duration-300 group-hover:scale-110"
                        [class.text-accent-cyan]="(activeRoute$ | async)?.startsWith(item.route) && item.route !== '/'">
                {{ item.icon }}
              </mat-icon>
              
              <span class="font-medium whitespace-nowrap transition-opacity duration-300 flex-1"
                    [class.opacity-0]="collapsed$ | async"
                    [class.w-0]="collapsed$ | async">
                {{ item.label }}
              </span>

              @if (item.badge && (collapsed$ | async) === false) {
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent-purple/20 text-accent-cyan border border-accent-purple/30">
                  {{ item.badge }}
                </span>
              }

              @if (item.children && (collapsed$ | async) === false) {
                <mat-icon class="text-white/30 text-sm transition-transform duration-300"
                  [class.rotate-180]="expandedSections()[item.route]">
                  expand_more
                </mat-icon>
              }
            </a>

            <!-- Sub-navigation (expandable) -->
            @if (item.children && expandedSections()[item.route] && (collapsed$ | async) === false) {
              <div class="ml-4 mt-1 space-y-0.5 border-l border-white/5 pl-3 animate-[fadeIn_0.2s_ease]">
                
                <!-- Category: Basic -->
                <p class="text-[9px] uppercase tracking-widest text-white/25 font-bold px-2 pt-2 pb-1">Basic</p>
                @for (child of getByCategory(item.children, 'basic'); track child.route) {
                  <a [routerLink]="child.route"
                     routerLinkActive="bg-cyan-400/10 text-cyan-400"
                     class="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-white/50 hover:text-white hover:bg-white/5 transition-all duration-200">
                    <span class="text-sm">{{ child.emoji }}</span>
                    <span>{{ child.label }}</span>
                  </a>
                }

                <!-- Category: Advanced -->
                <p class="text-[9px] uppercase tracking-widest text-white/25 font-bold px-2 pt-3 pb-1">Advanced</p>
                @for (child of getByCategory(item.children, 'advanced'); track child.route) {
                  <a [routerLink]="child.route"
                     routerLinkActive="bg-violet-400/10 text-violet-400"
                     class="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-white/50 hover:text-white hover:bg-white/5 transition-all duration-200">
                    <span class="text-sm">{{ child.emoji }}</span>
                    <span>{{ child.label }}</span>
                  </a>
                }

                <!-- Category: Pro -->
                <p class="text-[9px] uppercase tracking-widest text-white/25 font-bold px-2 pt-3 pb-1">Pro</p>
                @for (child of getByCategory(item.children, 'pro'); track child.route) {
                  <a [routerLink]="child.route"
                     routerLinkActive="bg-amber-400/10 text-amber-400"
                     class="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-white/50 hover:text-white hover:bg-white/5 transition-all duration-200">
                    <span class="text-sm">{{ child.emoji }}</span>
                    <span>{{ child.label }}</span>
                  </a>
                }

                <!-- Category: AI -->
                <p class="text-[9px] uppercase tracking-widest text-white/25 font-bold px-2 pt-3 pb-1">AI Powered</p>
                @for (child of getByCategory(item.children, 'ai'); track child.route) {
                  <a [routerLink]="child.route"
                     routerLinkActive="bg-emerald-400/10 text-emerald-400"
                     class="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-white/50 hover:text-white hover:bg-white/5 transition-all duration-200">
                    <span class="text-sm">{{ child.emoji }}</span>
                    <span>{{ child.label }}</span>
                  </a>
                }
              </div>
            }
          </div>
        }
      </nav>

      <!-- Footer Status -->
      <div class="p-4 border-t border-white/10">
        <div class="flex items-center gap-3 px-2">
          <div class="relative flex h-3 w-3 shrink-0">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-success opacity-75"></span>
            <span class="relative inline-flex rounded-full h-3 w-3 bg-status-success"></span>
          </div>
          <span class="text-sm font-medium text-text-secondary whitespace-nowrap transition-opacity duration-300"
                [class.opacity-0]="collapsed$ | async"
                [class.w-0]="collapsed$ | async">
            System Online
          </span>
        </div>
      </div>
    </aside>
  `,
  styles: [`
    .scrollbar-thin::-webkit-scrollbar { width: 4px; }
    .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
    .scrollbar-thin::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 4px; }
    .scrollbar-thin::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.15); }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class SidebarComponent {
  private store = inject(Store);
  navItems = NAV_ITEMS;
  collapsed$ = this.store.select(selectSidebarCollapsed);
  activeRoute$ = this.store.select(selectActiveRoute);
  
  toggleCollapse = output<void>();

  /** Track which sections are expanded */
  expandedSections = signal<Record<string, boolean>>({});

  onToggleCollapse() {
    this.store.dispatch(toggleSidebar());
    this.toggleCollapse.emit();
  }

  toggleExpand(route: string) {
    this.expandedSections.update(sections => ({
      ...sections,
      [route]: !sections[route]
    }));
  }

  getByCategory(children: NavChild[], category: string): NavChild[] {
    return children.filter(c => c.category === category);
  }
}
