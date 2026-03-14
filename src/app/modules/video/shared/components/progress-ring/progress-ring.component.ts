import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-progress-ring',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative flex flex-col items-center justify-center p-6 bg-[#0a0a0f]/50 backdrop-blur-xl rounded-3xl border border-white/5 shadow-2xl transition-all duration-500 animate-fade-in-up">
      <!-- Glow behind ring -->
      <div class="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-3xl blur-xl"></div>
      
      <div class="relative z-10 flex flex-col items-center gap-4">
        <svg [attr.width]="size" [attr.height]="size" viewBox="0 0 100 100" class="drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]">
          <!-- Background Track -->
          <circle cx="50" cy="50" [attr.r]="radius" fill="none" stroke="rgba(255,255,255,0.05)" [attr.stroke-width]="strokeWidth"/>
          
          <!-- Animated Progress Ring -->
          <circle cx="50" cy="50" [attr.r]="radius" fill="none" [attr.stroke]="color" [attr.stroke-width]="strokeWidth"
            stroke-linecap="round" [attr.stroke-dasharray]="circumference" [attr.stroke-dashoffset]="dashOffset"
            transform="rotate(-90 50 50)" class="transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
            [style.filter]="'drop-shadow(0 0 8px ' + color + ')'"/>
            
          <!-- Inner Text Container -->
          <foreignObject x="0" y="0" width="100" height="100">
            <div class="w-full h-full flex flex-col items-center justify-center overflow-visible">
              <span class="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300 drop-shadow-md tracking-tighter">{{ progress }}%</span>
            </div>
          </foreignObject>
        </svg>
        
        @if (label) { 
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
            <p class="text-sm font-medium text-white/80 tracking-wide">{{ label }}</p> 
          </div>
        }
      </div>
    </div>
  `
})
export class ProgressRingComponent {
  @Input() progress = 0;
  @Input() size = 80;
  @Input() strokeWidth = 6;
  @Input() color = '#00f5ff';
  @Input() label = '';
  get radius() { return (100 - this.strokeWidth * 2) / 2; }
  get circumference() { return 2 * Math.PI * this.radius; }
  get dashOffset() { return this.circumference * (1 - this.progress / 100); }
}
