import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { selectSystem } from '../../store/app.selectors';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="h-16 glass-panel border-b border-white/10 flex items-center justify-between px-6 sticky top-0 z-50 transition-all duration-300">
      
      <!-- Search Bar -->
      <div class="flex items-center gap-4 flex-1 max-w-md">
        <div class="relative w-full group">
          <mat-icon class="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent-cyan transition-colors">search</mat-icon>
          <input type="text" placeholder="Search tools, tasks, files..." 
                 class="w-full bg-bg-elevated/50 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-cyan/50 focus:ring-1 focus:ring-accent-cyan/50 transition-all duration-300">
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-4">
        <!-- Status Badge -->
        <div class="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
          <span class="w-2 h-2 rounded-full" 
                [class.bg-status-success]="(system$ | async)?.networkStatus === 'online'"
                [class.bg-status-error]="(system$ | async)?.networkStatus === 'offline'"></span>
          <span class="text-xs font-medium text-text-secondary">
            {{ (system$ | async)?.networkStatus === 'online' ? 'Connected' : 'Offline' }}
          </span>
        </div>

        <!-- Notifications -->
        <button class="relative w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors text-text-secondary hover:text-white">
          <mat-icon>notifications</mat-icon>
          <span class="absolute top-2 right-2 w-2 h-2 rounded-full bg-accent-pink animate-pulse"></span>
        </button>

        <!-- Profile -->
        <div class="flex items-center gap-3 pl-4 border-l border-white/10">
          <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-accent-purple to-accent-cyan flex items-center justify-center text-sm font-bold shadow-glow">
            K
          </div>
          <div class="hidden md:flex flex-col">
            <span class="text-sm font-medium leading-none">Kapten</span>
            <span class="text-[10px] text-text-muted uppercase tracking-wider mt-1">Admin</span>
          </div>
        </div>
      </div>
    </header>
  `
})
export class NavbarComponent {
  private store = inject(Store);
  system$ = this.store.select(selectSystem);
}
