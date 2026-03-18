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
    <div class="glass-panel rounded-xl p-6 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-glow group" 
         tabindex="0" 
         (click)="navigate()" 
         (keydown.enter)="navigate()">
      <div class="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-accent-cyan/20 transition-colors duration-300">
        <mat-icon class="text-3xl text-text-secondary group-hover:text-accent-cyan transition-colors duration-300">{{ tool().icon }}</mat-icon>
      </div>
      <span class="text-sm font-medium text-text-primary text-center">{{ tool().label }}</span>
      <span class="text-[10px] uppercase tracking-wider px-2 py-1 rounded-full border" 
            [class]="getStatusClass(tool().status)">
        {{ tool().status }}
      </span>
    </div>
  `
})
export class ToolCardComponent {
  private router = inject(Router);
  tool = input.required<Tool>();
  basePath = input<string>('video');

  navigate() {
    const base = this.basePath().startsWith('/') ? this.basePath() : '/' + this.basePath();
    this.router.navigate([base, this.tool().id]);
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
