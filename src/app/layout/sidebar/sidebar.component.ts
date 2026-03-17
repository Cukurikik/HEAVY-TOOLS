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
  { label: 'Dashboard',    icon: 'grid_view',   route: '/dashboard', badge: null },
  { label: 'A.N.I.T.A',    icon: 'smart_toy',   route: '/dashboard/anita',     badge: 'AI' },
  { label: 'Video Engine', icon: 'movie',       route: '/dashboard/video',     badge: '30+' },
  { label: 'Audio Studio', icon: 'music_note',  route: '/dashboard/audio',     badge: '30+' },
  { label: 'Image Matrix', icon: 'image',       route: '/dashboard/image',     badge: '6+' },
  { label: 'PDF Crypto',   icon: 'picture_as_pdf', route: '/dashboard/pdf',    badge: '30+' },
  { label: 'Converter',    icon: 'sync',        route: '/dashboard/converter', badge: 'NEW' },
  { label: 'Settings',     icon: 'settings',    route: '/dashboard/settings',  badge: null },
];

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <aside class="h-screen glass-panel border-r border-white/10 flex flex-col transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] relative z-50 bg-[#050505]/80 backdrop-blur-xl"
           [class.w-[260px]]="(collapsed$ | async) === false"
           [class.w-[72px]]="collapsed$ | async">
      
      <!-- Header -->
      <div class="h-16 flex items-center justify-between px-4 border-b border-white/10">
        <div class="flex items-center gap-3 overflow-hidden whitespace-nowrap" [class.opacity-0]="collapsed$ | async" [class.w-0]="collapsed$ | async">
          <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00f5ff] to-[#a200ff] flex items-center justify-center shadow-[0_0_15px_rgba(0,245,255,0.4)]">
            <mat-icon class="text-white text-xl">all_inclusive</mat-icon>
          </div>
          <span class="font-bold text-lg tracking-tight text-white">Omni-Tool</span>
        </div>
        @if (collapsed$ | async; as isCollapsed) {
          <button class="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors text-gray-400 hover:text-white shrink-0 focus-visible:ring-2 focus-visible:ring-[#00f5ff] focus-visible:outline-none"
                  [attr.aria-label]="isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
                  [attr.aria-expanded]="!isCollapsed"
                  (click)="onToggleCollapse()">
            <mat-icon>{{ isCollapsed ? 'menu' : 'menu_open' }}</mat-icon>
          </button>
        } @else {
          <button class="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors text-gray-400 hover:text-white shrink-0 focus-visible:ring-2 focus-visible:ring-[#00f5ff] focus-visible:outline-none"
                  [attr.aria-label]="'Collapse sidebar'"
                  [attr.aria-expanded]="true"
                  (click)="onToggleCollapse()">
            <mat-icon>menu_open</mat-icon>
          </button>
        }
      </div>

      <!-- Navigation -->
      <nav class="flex-1 py-6 px-3 space-y-2 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        @for (item of navItems; track item.route) {
          <a [routerLink]="item.route"
             routerLinkActive="bg-white/10 text-white shadow-[inset_4px_0_0_0_#00f5ff]"
             [routerLinkActiveOptions]="{exact: item.route === '/dashboard'}"
             class="flex items-center gap-4 px-3 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300 group relative"
             [title]="(collapsed$ | async) ? item.label : ''">
            
            <mat-icon class="shrink-0 transition-transform duration-300 group-hover:scale-110"
                      [class.text-[#00f5ff]]="(activeRoute$ | async) === item.route">
              {{ item.icon }}
            </mat-icon>
            
            <span class="font-medium whitespace-nowrap transition-opacity duration-300"
                  [class.opacity-0]="collapsed$ | async"
                  [class.w-0]="collapsed$ | async">
              {{ item.label }}
            </span>

            @if (item.badge && (collapsed$ | async) === false) {
              <span class="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#a200ff]/20 text-[#00f5ff] border border-[#a200ff]/30 shadow-[0_0_8px_rgba(162,0,255,0.3)]">
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
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-3 w-3 bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]"></span>
          </div>
          <span class="text-sm font-medium text-gray-400 whitespace-nowrap transition-opacity duration-300"
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
