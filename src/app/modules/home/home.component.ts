import { ChangeDetectionStrategy, Component, ElementRef, ViewChild, afterNextRender, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface FeatureBlock {
  title: string;
  desc: string;
  icon: string;
  stats: string;
  tools: string[];
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-[#050505] min-h-screen text-white overflow-x-hidden font-sans relative" #container>

      <!-- Ambient Background Effects -->
      <div class="fixed inset-0 z-0 pointer-events-none">
        <div class="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#00f5ff]/10 blur-[150px] mix-blend-screen floating-orb"></div>
        <div class="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-[#a200ff]/10 blur-[180px] mix-blend-screen floating-orb-delayed"></div>
        <div class="absolute top-[40%] left-[50%] translate-x-[-50%] w-[80vw] h-[30vw] rounded-full bg-[#00f5ff]/5 blur-[120px] mix-blend-screen"></div>
        <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDQwIEwgNDAgNDAgTCA0MCAwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-40"></div>
      </div>

      <!-- Header Navbar -->
      <nav class="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-5 bg-[#050505]/70 backdrop-blur-xl border-b border-white/5 nav-element translate-y-[-100%]">
        <div class="flex items-center gap-4 group cursor-pointer">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00f5ff] to-[#a200ff] flex items-center justify-center shadow-[0_0_20px_rgba(0,245,255,0.4)] group-hover:shadow-[0_0_30px_rgba(162,0,255,0.6)] transition-all duration-500">
            <mat-icon class="text-white text-2xl">all_inclusive</mat-icon>
          </div>
          <span class="text-2xl font-bold tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Omni-Tool</span>
        </div>
        <button (click)="navigateToLogin()" class="relative px-8 py-3 rounded-full overflow-hidden group border border-white/10 hover:border-[#00f5ff]/50 transition-colors duration-300">
          <div class="absolute inset-0 bg-[#00f5ff]/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
          <span class="relative flex items-center gap-2 font-bold tracking-wide text-sm">
            LOGIN <mat-icon class="text-[18px] text-[#00f5ff] group-hover:translate-x-1 transition-transform">login</mat-icon>
          </span>
        </button>
      </nav>

      <!-- HERO SECTION -->
      <section class="relative z-10 flex flex-col items-center justify-center min-h-[100vh] px-4 pt-20 text-center max-w-6xl mx-auto">
        <div class="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 mb-8 hero-element opacity-0 scale-95 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
          <span class="w-2.5 h-2.5 rounded-full bg-[#00f5ff] shadow-[0_0_8px_#00f5ff] animate-pulse"></span>
          <span class="text-xs font-bold tracking-[0.2em] text-[#00f5ff]">PHASE 19 DEPLOYED</span>
        </div>

        <h1 class="text-6xl md:text-8xl lg:text-[110px] font-black tracking-tighter mb-8 leading-[0.9] hero-title opacity-0 translate-y-12">
          THE ULTIMATE <br/>
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#00f5ff] via-blue-400 to-[#a200ff] inline-block filter drop-shadow-[0_0_30px_rgba(0,245,255,0.3)]">HYBRID WORKSPACE</span>
        </h1>

        <p class="text-xl md:text-3xl text-gray-400 max-w-4xl mb-14 hero-desc opacity-0 translate-y-8 font-light leading-relaxed">
          Over <span class="text-white font-semibold">100+ Professional Tools</span> running completely locally in your browser. Zero uploads. Zero latency. Infinite power.
        </p>

        <div class="flex flex-col sm:flex-row gap-6 hero-actions opacity-0 translate-y-8">
          <button (click)="navigateToLogin()" class="group relative px-10 py-5 rounded-2xl bg-gradient-to-r from-[#00f5ff] to-blue-500 text-black font-black text-lg overflow-hidden shadow-[0_0_40px_rgba(0,245,255,0.4)] hover:shadow-[0_0_60px_rgba(0,245,255,0.6)] hover:scale-105 transition-all duration-300">
            <span class="relative flex items-center gap-3">
              ENTER OMNI-DASHBOARD <mat-icon>rocket_launch</mat-icon>
            </span>
          </button>
        </div>
      </section>

      <!-- THE ARSENAL OVERVIEW (SCROLL INTENSIVE) -->
      <section class="relative z-10 py-32 px-6 max-w-7xl mx-auto" #featuresSection>
        <div class="text-center mb-24 section-header">
          <h2 class="text-5xl md:text-7xl font-black mb-6 tracking-tight">THE OMNI ARSENAL</h2>
          <p class="text-2xl text-gray-400 font-light">Industry-grade processing via WebAssembly & WebGPU.</p>
        </div>

        <div class="space-y-32">
          <!-- Video Engine -->
          <div class="feature-row flex flex-col lg:flex-row gap-16 items-center">
            <div class="flex-1 space-y-8">
              <div class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00f5ff]/10 text-[#00f5ff] border border-[#00f5ff]/20 font-mono text-sm">
                <mat-icon class="text-sm">movie</mat-icon> FFmpeg WASM Core
              </div>
              <h3 class="text-5xl font-bold">Video Titan Engine</h3>
              <p class="text-xl text-gray-400 leading-relaxed">Edit, convert, and render 4K video directly in the browser memory. Includes 30+ tools ranging from frame-precise trimming to AI upscaling and color grading.</p>
              <div class="grid grid-cols-2 gap-4">
                <div class="glass-pill"><mat-icon class="text-[#00f5ff]">content_cut</mat-icon> Precise Trimmer</div>
                <div class="glass-pill"><mat-icon class="text-[#00f5ff]">rocket</mat-icon> AI Upscaler</div>
                <div class="glass-pill"><mat-icon class="text-[#00f5ff]">palette</mat-icon> Color Grading</div>
                <div class="glass-pill"><mat-icon class="text-[#00f5ff]">compress</mat-icon> Smart Compressor</div>
              </div>
            </div>
            <div class="flex-1 w-full aspect-video rounded-3xl glass-panel relative overflow-hidden border border-white/10 group">
              <div class="absolute inset-0 bg-gradient-to-br from-[#00f5ff]/5 to-transparent"></div>
              <div class="absolute inset-0 flex items-center justify-center">
                <mat-icon class="text-9xl text-white/10 group-hover:text-[#00f5ff]/40 transition-colors duration-700">movie_creation</mat-icon>
              </div>
            </div>
          </div>

          <!-- Audio Studio -->
          <div class="feature-row flex flex-col lg:flex-row-reverse gap-16 items-center">
            <div class="flex-1 space-y-8">
              <div class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#a200ff]/10 text-[#a200ff] border border-[#a200ff]/20 font-mono text-sm">
                <mat-icon class="text-sm">graphic_eq</mat-icon> AudioWorklet & ONNX
              </div>
              <h3 class="text-5xl font-bold">Mastering Audio Studio</h3>
              <p class="text-xl text-gray-400 leading-relaxed">Zero-latency offline rendering. 30+ tools including AI Stem Splitters, Parametric EQs, Compressors, and Multi-track mixing capabilities.</p>
              <div class="grid grid-cols-2 gap-4">
                <div class="glass-pill"><mat-icon class="text-[#a200ff]">call_split</mat-icon> AI Stem Splitter</div>
                <div class="glass-pill"><mat-icon class="text-[#a200ff]">tune</mat-icon> 10-Band EQ</div>
                <div class="glass-pill"><mat-icon class="text-[#a200ff]">waves</mat-icon> Noise Remover</div>
                <div class="glass-pill"><mat-icon class="text-[#a200ff]">mic</mat-icon> Multi-track Mixer</div>
              </div>
            </div>
            <div class="flex-1 w-full aspect-video rounded-3xl glass-panel relative overflow-hidden border border-white/10 group">
              <div class="absolute inset-0 bg-gradient-to-bl from-[#a200ff]/5 to-transparent"></div>
              <div class="absolute inset-0 flex items-center justify-center">
                <mat-icon class="text-9xl text-white/10 group-hover:text-[#a200ff]/40 transition-colors duration-700">equalizer</mat-icon>
              </div>
            </div>
          </div>

          <!-- PDF Crypto Forge -->
          <div class="feature-row flex flex-col lg:flex-row gap-16 items-center">
            <div class="flex-1 space-y-8">
              <div class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20 font-mono text-sm">
                <mat-icon class="text-sm">security</mat-icon> PDF-lib & WebCrypto
              </div>
              <h3 class="text-5xl font-bold">PDF Crypto Forge</h3>
              <p class="text-xl text-gray-400 leading-relaxed">Secure document processing. 30+ tools for merging, splitting, WASM OCR text extraction, PAdES digital signatures, and AES-256 encryption.</p>
              <div class="grid grid-cols-2 gap-4">
                <div class="glass-pill"><mat-icon class="text-orange-400">document_scanner</mat-icon> WASM OCR</div>
                <div class="glass-pill"><mat-icon class="text-orange-400">vpn_key</mat-icon> AES Encryption</div>
                <div class="glass-pill"><mat-icon class="text-orange-400">draw</mat-icon> Digital Signatures</div>
                <div class="glass-pill"><mat-icon class="text-orange-400">merge_type</mat-icon> Merge & Split</div>
              </div>
            </div>
            <div class="flex-1 w-full aspect-video rounded-3xl glass-panel relative overflow-hidden border border-white/10 group">
              <div class="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent"></div>
              <div class="absolute inset-0 flex items-center justify-center">
                <mat-icon class="text-9xl text-white/10 group-hover:text-orange-400/40 transition-colors duration-700">picture_as_pdf</mat-icon>
              </div>
            </div>
          </div>

          <!-- Image Matrix -->
          <div class="feature-row flex flex-col lg:flex-row-reverse gap-16 items-center">
            <div class="flex-1 space-y-8">
              <div class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20 font-mono text-sm">
                <mat-icon class="text-sm">memory</mat-icon> WebGL Canvas
              </div>
              <h3 class="text-5xl font-bold">Image Matrix GPU</h3>
              <p class="text-xl text-gray-400 leading-relaxed">Hardware-accelerated image manipulation. ESRGAN AI upscaling, HEIC conversion, Background removal, and real-time WebGL filters.</p>
              <div class="grid grid-cols-2 gap-4">
                <div class="glass-pill"><mat-icon class="text-green-400">high_quality</mat-icon> AI Upscaler</div>
                <div class="glass-pill"><mat-icon class="text-green-400">flip</mat-icon> BG Remover</div>
                <div class="glass-pill"><mat-icon class="text-green-400">transform</mat-icon> HEIC Converter</div>
                <div class="glass-pill"><mat-icon class="text-green-400">filter_b_and_w</mat-icon> WebGL Filters</div>
              </div>
            </div>
            <div class="flex-1 w-full aspect-video rounded-3xl glass-panel relative overflow-hidden border border-white/10 group">
              <div class="absolute inset-0 bg-gradient-to-bl from-green-500/5 to-transparent"></div>
              <div class="absolute inset-0 flex items-center justify-center">
                <mat-icon class="text-9xl text-white/10 group-hover:text-green-400/40 transition-colors duration-700">image</mat-icon>
              </div>
            </div>
          </div>

          <!-- A.N.I.T.A Code Assist & AI Music -->
          <div class="feature-row flex flex-col lg:flex-row gap-16 items-center">
            <div class="flex-1 space-y-8">
              <div class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono text-sm">
                <mat-icon class="text-sm">smart_toy</mat-icon> Neural Networks
              </div>
              <h3 class="text-5xl font-bold">A.N.I.T.A & AI Generative</h3>
              <p class="text-xl text-gray-400 leading-relaxed">Your personal CTO Code Assistant to refactor, analyze, and architect software. Plus, a built-in AI Music Generator for royalty-free tracks.</p>
              <div class="grid grid-cols-2 gap-4">
                <div class="glass-pill"><mat-icon class="text-blue-400">code</mat-icon> Code Refactoring</div>
                <div class="glass-pill"><mat-icon class="text-blue-400">psychology</mat-icon> Logic Analysis</div>
                <div class="glass-pill"><mat-icon class="text-blue-400">music_note</mat-icon> Music Generation</div>
                <div class="glass-pill"><mat-icon class="text-blue-400">terminal</mat-icon> Regex Builder</div>
              </div>
            </div>
            <div class="flex-1 w-full aspect-video rounded-3xl glass-panel relative overflow-hidden border border-white/10 group">
              <div class="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent"></div>
              <div class="absolute inset-0 flex items-center justify-center">
                <mat-icon class="text-9xl text-white/10 group-hover:text-blue-400/40 transition-colors duration-700">memory</mat-icon>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- PERFORMANCE STATS -->
      <section class="relative z-10 py-32 px-6 border-y border-white/5 bg-[#0a0a0a]">
        <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div class="stat-block space-y-4">
            <div class="text-7xl font-black text-[#00f5ff] drop-shadow-[0_0_15px_rgba(0,245,255,0.5)]">0ms</div>
            <div class="text-xl font-bold tracking-widest uppercase text-white">Server Latency</div>
            <p class="text-gray-500">Files never leave your device.</p>
          </div>
          <div class="stat-block space-y-4">
            <div class="text-7xl font-black text-[#a200ff] drop-shadow-[0_0_15px_rgba(162,0,255,0.5)]">120</div>
            <div class="text-xl font-bold tracking-widest uppercase text-white">FPS UI Render</div>
            <p class="text-gray-500">Silky smooth Angular OnPush architecture.</p>
          </div>
          <div class="stat-block space-y-4">
            <div class="text-7xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">100%</div>
            <div class="text-xl font-bold tracking-widest uppercase text-white">Offline Ready</div>
            <p class="text-gray-500">Works without an internet connection.</p>
          </div>
        </div>
      </section>

      <!-- FOOTER CTA -->
      <footer class="relative z-10 py-40 text-center overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-t from-[#00f5ff]/10 to-transparent pointer-events-none"></div>
        <div class="max-w-4xl mx-auto px-6 relative z-10">
          <h2 class="text-5xl md:text-7xl font-black mb-12 tracking-tight">THE FUTURE IS LOCAL.</h2>
          <button (click)="navigateToLogin()" class="group relative px-16 py-6 rounded-full bg-white text-black font-black text-2xl overflow-hidden shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:scale-105 transition-all duration-300">
            <div class="absolute inset-0 bg-gradient-to-r from-[#00f5ff] to-[#a200ff] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span class="relative z-10 flex items-center gap-3 group-hover:text-white transition-colors duration-300">
              START PROCESSING <mat-icon class="text-3xl">bolt</mat-icon>
            </span>
          </button>
        </div>
        <div class="mt-32 text-gray-600 text-sm tracking-[0.3em] font-bold uppercase">
          © 2024 Omni-Tool Phase 19 System
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .glass-panel {
      background: rgba(255, 255, 255, 0.02);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
    }
    .glass-pill {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 999px;
      padding: 0.75rem 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      font-weight: 500;
      color: #e5e7eb;
    }
    .floating-orb {
      animation: float 25s ease-in-out infinite;
    }
    .floating-orb-delayed {
      animation: float 30s ease-in-out infinite reverse;
      animation-delay: -5s;
    }
    @keyframes float {
      0%, 100% { transform: translate(0, 0) scale(1); }
      33% { transform: translate(5%, 15%) scale(1.1); }
      66% { transform: translate(-10%, 5%) scale(0.9); }
    }
  `]
})
export class HomeComponent {
  private router = inject(Router);
  @ViewChild('container') container!: ElementRef;

  constructor() {
    afterNextRender(() => {
      this.initAnimations();
    });
  }

  initAnimations() {
    if (!this.container) return;

    // Header Entrance
    gsap.to('.nav-element', { y: 0, duration: 1, ease: 'power4.out', delay: 0.2 });

    // Hero Entrance
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.to('.hero-element', { scale: 1, opacity: 1, duration: 0.8 }, 0.5)
      .to('.hero-title', { y: 0, opacity: 1, duration: 1 }, 0.7)
      .to('.hero-desc', { y: 0, opacity: 1, duration: 1 }, 0.9)
      .to('.hero-actions', { y: 0, opacity: 1, duration: 1 }, 1.1);

    // Scroll Animations for Feature Rows
    const rows = document.querySelectorAll('.feature-row');
    rows.forEach((row) => {
      gsap.fromTo(row,
        { opacity: 0, y: 100 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: row,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });

    // Stats Counter Animation
    const stats = document.querySelectorAll('.stat-block');
    gsap.fromTo(stats,
      { opacity: 0, scale: 0.8, y: 50 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'back.out(1.5)',
        scrollTrigger: {
          trigger: stats[0].parentElement,
          start: 'top 80%'
        }
      }
    );
  }

  navigateToLogin() {
    gsap.to(this.container.nativeElement, {
      opacity: 0,
      scale: 0.95,
      duration: 0.5,
      ease: 'power2.inOut',
      onComplete: () => {
        this.router.navigate(['/login']);
      }
    });
  }
}
