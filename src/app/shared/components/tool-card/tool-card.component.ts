import { ChangeDetectionStrategy, Component, input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

export interface Tool {
  id: string;
  label: string;
  icon: string;
  category: string;
  status: string;
}

@Component({
  selector: 'app-tool-card',
  standalone: true,
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative group cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02]" 
         tabindex="0" 
         (click)="navigate()" 
         (keydown.enter)="navigate()">
         
      <!-- Animated Gradient Border (visible on hover) -->
      <div class="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm group-hover:blur-md"></div>
      
      <!-- Main Glass Panel -->
      <div class="relative h-full bg-[#0a0a0f]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center gap-5 transition-all duration-500 group-hover:bg-[#0a0a0f]/90 group-hover:border-white/20 z-10 overflow-hidden">
        
        <!-- Background Glow Accent -->
        <div class="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all duration-500"></div>

        <!-- Icon Container -->
        <div class="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 border border-white/5 flex items-center justify-center group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all duration-500 overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <mat-icon class="text-4xl text-white/70 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-indigo-300 transition-all duration-500 z-10">{{ tool().icon }}</mat-icon>
        </div>
        
        <!-- Text Content -->
        <div class="flex flex-col items-center gap-2 z-10">
          <span class="text-base font-semibold text-white/90 text-center tracking-wide group-hover:text-white transition-colors duration-300">{{ tool().label }}</span>
          
          <span class="text-[9px] font-bold uppercase tracking-[0.2em] px-2.5 py-1 rounded-full border shadow-sm backdrop-blur-md transition-colors duration-300" 
                [class]="getStatusClass(tool().status)">
            {{ tool().status }}
          </span>
        </div>
      </div>
    </div>
  `
})
export class ToolCardComponent {
  private router = inject(Router);
  tool = input.required<Tool>();

  navigate() {
    // Navigate to tool specific route
    // this.router.navigate(['/tool', this.tool().id]);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'stable': return 'text-status-success border-status-success/30 bg-status-success/10';
      case 'beta': return 'text-status-warning border-status-warning/30 bg-status-warning/10';
      case 'experimental': return 'text-status-info border-status-info/30 bg-status-info/10';
      default: return 'text-text-secondary border-text-secondary/30 bg-white/5';
    }
  }
}
