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

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard',    icon: 'grid_view',   route: '/',          badge: null },
  { label: 'Video Engine', icon: 'movie',        route: '/video',     badge: '30', children: VIDEO_CHILDREN },
  { label: 'Audio Studio', icon: 'music_note',   route: '/audio',     badge: '20+' },
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
