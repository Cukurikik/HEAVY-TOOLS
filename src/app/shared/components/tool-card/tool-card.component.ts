import { ChangeDetectionStrategy, Component, input, inject, ElementRef, ViewChild, afterNextRender } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { gsap } from 'gsap';

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
    <div #card
         class="relative glass-panel rounded-2xl p-6 flex flex-col items-center justify-center gap-4 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#00f5ff] focus-visible:outline-none overflow-hidden isolate"
         role="button"
         [attr.aria-label]="'Open ' + tool().label + ' tool'"
         tabindex="0" 
         (click)="navigate()" 
         (keydown.enter)="navigate()"
         (keydown.space)="$event.preventDefault(); navigate()"
         (mousemove)="handleMouseMove($event)"
         (mouseleave)="handleMouseLeave()">

      <!-- Border Glow Effect -->
      <div class="glow-bg absolute -inset-px bg-gradient-to-br opacity-0 rounded-2xl pointer-events-none transition-opacity duration-300 z-0"
           [class]="getGlowClass(tool().category)"></div>

      <!-- Content Background -->
      <div class="absolute inset-[1px] rounded-2xl bg-[#0a0a0a]/90 backdrop-blur-xl pointer-events-none z-10"></div>

      <div class="w-14 h-14 rounded-xl flex items-center justify-center relative z-20 transition-all duration-300 icon-container"
           [class]="getIconBgClass(tool().category)">
        <mat-icon class="text-3xl transition-colors duration-300"
                  [class]="getIconColorClass(tool().category)">
          {{ tool().icon }}
        </mat-icon>
      </div>

      <span class="text-sm font-bold text-gray-200 text-center relative z-20 tracking-wide">{{ tool().label }}</span>

      <span class="text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full relative z-20"
            [class]="getStatusClass(tool().status)">
        {{ tool().status }}
      </span>
    </div>
  `,
  styles: [`
    .glass-panel {
      transform-style: preserve-3d;
      perspective: 1000px;
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
    }
  `]
})
export class ToolCardComponent {
  private router = inject(Router);
  @ViewChild('card') cardRef!: ElementRef;

  tool = input.required<Tool>();
  basePath = input<string>('video');

  navigate() {
    this.router.navigate(['/dashboard', this.basePath(), this.tool().id]);
  }

  handleMouseMove(event: MouseEvent) {
    if (!this.cardRef) return;
    const card = this.cardRef.nativeElement;

    // Magnetic / Bergerak sendiri parallax effect
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -15; // Invert to look like it's pointing to cursor
    const rotateY = ((x - centerX) / centerX) * 15;

    // Show glow
    const glowBg = card.querySelector('.glow-bg');
    if (glowBg) glowBg.style.opacity = '1';

    gsap.to(card, {
      rotationX: rotateX,
      rotationY: rotateY,
      scale: 1.05,
      duration: 0.4,
      ease: 'power2.out',
      transformPerspective: 1000,
      boxShadow: '0 20px 40px rgba(0,0,0,0.8)'
    });

    // Move icon slightly more for parallax depth
    const iconContainer = card.querySelector('.icon-container');
    if (iconContainer) {
      gsap.to(iconContainer, {
        x: (x - centerX) * 0.1,
        y: (y - centerY) * 0.1,
        duration: 0.4,
        ease: 'power2.out'
      });
    }
  }

  handleMouseLeave() {
    if (!this.cardRef) return;
    const card = this.cardRef.nativeElement;

    // Hide glow
    const glowBg = card.querySelector('.glow-bg');
    if (glowBg) glowBg.style.opacity = '0';

    gsap.to(card, {
      rotationX: 0,
      rotationY: 0,
      scale: 1,
      duration: 0.6,
      ease: 'elastic.out(1, 0.5)',
      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.5)'
    });

    const iconContainer = card.querySelector('.icon-container');
    if (iconContainer) {
      gsap.to(iconContainer, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
    }
  }

  getGlowClass(category: string): string {
    switch (category) {
      case 'video': return 'from-[#00f5ff] to-blue-500';
      case 'audio': return 'from-[#a200ff] to-pink-500';
      case 'ai': return 'from-blue-500 to-[#a200ff]';
      case 'pdf': return 'from-orange-500 to-red-500';
      case 'image': return 'from-green-400 to-[#00f5ff]';
      default: return 'from-gray-500 to-gray-700';
    }
  }

  getIconBgClass(category: string): string {
    switch (category) {
      case 'video': return 'bg-[#00f5ff]/10 group-hover:bg-[#00f5ff]/20';
      case 'audio': return 'bg-[#a200ff]/10 group-hover:bg-[#a200ff]/20';
      case 'ai': return 'bg-blue-500/10 group-hover:bg-blue-500/20';
      case 'pdf': return 'bg-orange-500/10 group-hover:bg-orange-500/20';
      case 'image': return 'bg-green-500/10 group-hover:bg-green-500/20';
      default: return 'bg-gray-500/10 group-hover:bg-gray-500/20';
    }
  }

  getIconColorClass(category: string): string {
    switch (category) {
      case 'video': return 'text-[#00f5ff] drop-shadow-[0_0_8px_rgba(0,245,255,0.5)]';
      case 'audio': return 'text-[#a200ff] drop-shadow-[0_0_8px_rgba(162,0,255,0.5)]';
      case 'ai': return 'text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]';
      case 'pdf': return 'text-orange-400 drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]';
      case 'image': return 'text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]';
      default: return 'text-gray-400';
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'stable': return 'text-green-400 border border-green-400/30 bg-green-400/10';
      case 'beta': return 'text-yellow-400 border border-yellow-400/30 bg-yellow-400/10';
      case 'experimental': return 'text-[#00f5ff] border border-[#00f5ff]/30 bg-[#00f5ff]/10';
      default: return 'text-gray-400 border border-gray-400/30 bg-gray-500/10';
    }
  }
}
