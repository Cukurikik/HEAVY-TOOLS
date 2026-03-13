import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, NavbarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="shell-layout flex h-screen w-full overflow-hidden bg-bg text-text-primary">
      <app-sidebar (toggleCollapse)="toggleSidebar()" class="z-40" />
      <main class="content-area flex-1 flex flex-col relative overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]">
        <app-navbar class="z-30" />
        <div class="page-content flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8">
          <router-outlet />
        </div>
      </main>
    </div>
  `
})
export class ShellComponent {
  sidebarCollapsed = signal(false);
  
  toggleSidebar() { 
    this.sidebarCollapsed.update(v => !v); 
  }
}
