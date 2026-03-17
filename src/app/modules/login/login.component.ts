import { ChangeDetectionStrategy, Component, ElementRef, ViewChild, afterNextRender, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { gsap } from 'gsap';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-[#050505] min-h-screen flex items-center justify-center relative overflow-hidden font-sans" #container>

      <!-- Ambient Background Effects -->
      <div class="absolute inset-0 z-0 pointer-events-none">
        <div class="absolute top-[20%] left-[20%] w-[40vw] h-[40vw] rounded-full bg-[#00f5ff]/10 blur-[150px] mix-blend-screen floating-orb"></div>
        <div class="absolute bottom-[20%] right-[20%] w-[50vw] h-[50vw] rounded-full bg-[#a200ff]/10 blur-[180px] mix-blend-screen floating-orb-delayed"></div>

        <!-- Technical Grid Mesh -->
        <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDIwIEwgMjAgMjAgTCAyMCAwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4wNCkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-60 pointer-events-none"></div>

        <!-- Animated glowing lines -->
        <div class="absolute top-0 left-[30%] w-px h-[30vh] bg-gradient-to-b from-transparent via-[#00f5ff]/50 to-transparent glowing-line"></div>
        <div class="absolute bottom-0 right-[40%] w-px h-[40vh] bg-gradient-to-t from-transparent via-[#a200ff]/50 to-transparent glowing-line-delayed"></div>
      </div>

      <!-- Back Button -->
      <button (click)="navigateBack()" class="absolute top-8 left-8 z-50 w-12 h-12 rounded-full glass-panel flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300 back-btn opacity-0 translate-x-[-20px]">
        <mat-icon>arrow_back</mat-icon>
      </button>

      <!-- Glassmorphic Login Card -->
      <div class="relative z-10 w-full max-w-md p-8 md:p-12 rounded-[2.5rem] glass-card border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] login-card opacity-0 translate-y-12">
        <!-- Glow Behind Card -->
        <div class="absolute -inset-[1px] rounded-[2.5rem] bg-gradient-to-br from-[#00f5ff]/30 to-[#a200ff]/30 opacity-50 pointer-events-none"></div>
        <div class="absolute inset-[1px] rounded-[2.5rem] bg-[#0a0a0a]/90 backdrop-blur-2xl pointer-events-none"></div>

        <!-- Content -->
        <div class="relative z-20">
          <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00f5ff] to-[#a200ff] flex items-center justify-center shadow-[0_0_30px_rgba(0,245,255,0.4)] mb-8 mx-auto logo-icon">
            <mat-icon class="text-white text-3xl">all_inclusive</mat-icon>
          </div>

          <h2 class="text-3xl font-black text-center text-white mb-2 tracking-tight">OMNI-LOGIN</h2>
          <p class="text-gray-400 text-center text-sm font-medium tracking-widest uppercase mb-10">Access Dashboard Phase 19</p>

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6 form-elements">
            <div class="space-y-2">
              <label class="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">Email Access</label>
              <div class="relative group">
                <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <mat-icon class="text-gray-500 group-focus-within:text-[#00f5ff] transition-colors">email</mat-icon>
                </div>
                <input type="email" formControlName="email"
                       class="w-full bg-white/5 border border-white/10 text-white rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-[#00f5ff] focus:bg-white/10 focus:ring-1 focus:ring-[#00f5ff] transition-all duration-300"
                       placeholder="admin@omni.tool">
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">Security Key</label>
              <div class="relative group">
                <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <mat-icon class="text-gray-500 group-focus-within:text-[#a200ff] transition-colors">lock</mat-icon>
                </div>
                <input type="password" formControlName="password"
                       class="w-full bg-white/5 border border-white/10 text-white rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-[#a200ff] focus:bg-white/10 focus:ring-1 focus:ring-[#a200ff] transition-all duration-300"
                       placeholder="••••••••">
              </div>
            </div>

            <div class="pt-4 pb-2">
              <button type="submit" [disabled]="!loginForm.valid"
                      class="w-full relative px-6 py-4 rounded-xl bg-gradient-to-r from-[#00f5ff] to-[#a200ff] text-white font-black text-lg uppercase tracking-widest overflow-hidden shadow-[0_0_20px_rgba(162,0,255,0.4)] hover:shadow-[0_0_40px_rgba(0,245,255,0.6)] hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed transition-all duration-300 group">
                <div class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                <span class="relative z-10 flex items-center justify-center gap-2">
                  INITIALIZE <mat-icon>power_settings_new</mat-icon>
                </span>
              </button>
            </div>

            <div class="flex justify-between text-xs font-semibold tracking-wider text-gray-500 uppercase px-2">
              <a href="#" class="hover:text-[#00f5ff] transition-colors">Forgot Key?</a>
              <a href="#" class="hover:text-[#a200ff] transition-colors">Request Access</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .glass-panel {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .glass-card {
      transform-style: preserve-3d;
      perspective: 1000px;
    }
    .floating-orb {
      animation: float 20s ease-in-out infinite;
    }
    .floating-orb-delayed {
      animation: float 25s ease-in-out infinite reverse;
      animation-delay: -5s;
    }
    .glowing-line {
      animation: scanline 4s linear infinite;
    }
    .glowing-line-delayed {
      animation: scanline 6s linear infinite reverse;
      animation-delay: -2s;
    }
    @keyframes float {
      0%, 100% { transform: translate(0, 0) scale(1); }
      33% { transform: translate(3%, 8%) scale(1.1); }
      66% { transform: translate(-3%, 3%) scale(0.9); }
    }
    @keyframes scanline {
      0% { transform: translateY(-100%); opacity: 0; }
      10% { opacity: 1; }
      90% { opacity: 1; }
      100% { transform: translateY(300%); opacity: 0; }
    }
  `]
})
export class LoginComponent {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  @ViewChild('container') container!: ElementRef;

  loginForm = this.fb.group({
    email: ['admin@omni.tool', [Validators.required, Validators.email]],
    password: ['omnitool123', [Validators.required, Validators.minLength(6)]]
  });

  constructor() {
    afterNextRender(() => {
      this.initAnimations();
    });
  }

  initAnimations() {
    if (!this.container) return;

    // Smooth 3D Entrance Animation
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    tl.to('.back-btn', { x: 0, opacity: 1, duration: 1, delay: 0.2 })
      .fromTo('.login-card',
        { y: 60, opacity: 0, rotationX: 15 },
        { y: 0, opacity: 1, rotationX: 0, duration: 1.2, clearProps: 'transform' },
        '-=0.8'
      )
      .fromTo('.logo-icon', { scale: 0, rotation: -90 }, { scale: 1, rotation: 0, duration: 0.8, ease: 'back.out(1.5)' }, '-=0.8')
      .fromTo('h2, p', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.1 }, '-=0.6')
      .fromTo('.form-elements > *', { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.1 }, '-=0.4');

    // 3D Tilt Effect on Mouse Move
    const card = this.container.nativeElement.querySelector('.login-card');
    this.container.nativeElement.addEventListener('mousemove', (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // x position within the element.
      const y = e.clientY - rect.top;  // y position within the element.

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -5; // Max rotation 5deg
      const rotateY = ((x - centerX) / centerX) * 5;

      gsap.to(card, {
        rotationX: rotateX,
        rotationY: rotateY,
        duration: 0.5,
        ease: 'power2.out',
        transformPerspective: 1000
      });
    });

    this.container.nativeElement.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotationX: 0,
        rotationY: 0,
        duration: 0.5,
        ease: 'power2.out'
      });
    });
  }

  navigateBack() {
    gsap.to(this.container.nativeElement, {
      opacity: 0,
      scale: 1.05,
      duration: 0.4,
      ease: 'power2.in',
      onComplete: () => {
        this.router.navigate(['/']);
      }
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      // Exit animation
      const tl = gsap.timeline({
        onComplete: () => {
          this.router.navigate(['/dashboard']);
        }
      });

      tl.to('.login-card', {
        scale: 0.9,
        y: -40,
        opacity: 0,
        duration: 0.5,
        ease: 'power3.in'
      }).to(this.container.nativeElement, {
        opacity: 0,
        duration: 0.3
      }, '-=0.2');
    }
  }
}
