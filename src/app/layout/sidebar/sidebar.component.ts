import { ChangeDetectionStrategy, Component, output, inject } from '@angular/core';
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
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard',    icon: 'grid_view',       route: '/',          badge: null },
  { label: 'Video Engine', icon: 'movie',           route: '/video',     badge: '30+' },
  { label: 'Audio Studio', icon: 'music_note',      route: '/audio',     badge: '30+' },
  { label: 'Image Matrix', icon: 'image',           route: '/image',     badge: '10+' },
  { label: 'PDF Engine',   icon: 'picture_as_pdf',  route: '/pdf',       badge: '30+' },
  { label: 'ANITA AI',     icon: 'psychology',      route: '/anita-ai',  badge: 'AI' },
  { label: 'Converter',    icon: 'sync',            route: '/converter', badge: '30+' },
  { label: 'Settings',     icon: 'settings',        route: '/settings',  badge: null },
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
      <nav class="flex-1 py-6 px-3 space-y-2 overflow-y-auto overflow-x-hidden">
        @for (item of navItems; track item.route) {
          <a [routerLink]="item.route"
             routerLinkActive="bg-white/10 text-white shadow-[inset_4px_0_0_0_#00f5ff]"
             [routerLinkActiveOptions]="{exact: item.route === '/'}"
             class="flex items-center gap-4 px-3 py-3 rounded-xl text-text-secondary hover:text-white hover:bg-white/5 transition-all duration-300 group relative"
             [title]="(collapsed$ | async) ? item.label : ''">
            
            <mat-icon class="shrink-0 transition-transform duration-300 group-hover:scale-110"
                      [class.text-accent-cyan]="(activeRoute$ | async) === item.route">
              {{ item.icon }}
            </mat-icon>
            
            <span class="font-medium whitespace-nowrap transition-opacity duration-300"
                  [class.opacity-0]="collapsed$ | async"
                  [class.w-0]="collapsed$ | async">
              {{ item.label }}
            </span>

            @if (item.badge && (collapsed$ | async) === false) {
              <span class="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent-purple/20 text-accent-cyan border border-accent-purple/30">
                {{ item.badge }}
              </span>
            }
          </a>
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
  `
})
export class SidebarComponent {
  private store = inject(Store);
  navItems = NAV_ITEMS;
  collapsed$ = this.store.select(selectSidebarCollapsed);
  activeRoute$ = this.store.select(selectActiveRoute);
  
  toggleCollapse = output<void>();

  onToggleCollapse() {
    this.store.dispatch(toggleSidebar());
    this.toggleCollapse.emit();
  }
}
