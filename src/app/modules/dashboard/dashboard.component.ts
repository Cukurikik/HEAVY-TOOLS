import { ChangeDetectionStrategy, Component, ElementRef, ViewChild, inject, afterNextRender } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { selectSystem, selectTasks } from '../../store/app.selectors';
import { map } from 'rxjs/operators';
import { ToolCardComponent, Tool } from '../../shared/components/tool-card/tool-card.component';
import { gsap } from 'gsap';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatIconModule, ToolCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-8 space-y-12 max-w-7xl mx-auto relative z-10" #container>

      <!-- Top Navbar (Search & Explore) -->
      <header class="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 glass-header p-6 rounded-3xl border border-white/5 opacity-0 -translate-y-8 dashboard-nav">
        <div class="relative w-full md:w-[400px] group">
          <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <mat-icon class="text-gray-500 group-focus-within:text-[#00f5ff] transition-colors">search</mat-icon>
          </div>
          <input type="text"
                 class="w-full bg-[#0a0a0a]/80 border border-white/10 text-white rounded-full py-3 pl-12 pr-4 focus:outline-none focus:border-[#00f5ff] focus:bg-white/5 focus:ring-1 focus:ring-[#00f5ff] transition-all duration-300 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]"
                 placeholder="Search 100+ tools...">
        </div>

        <button class="relative px-8 py-3 rounded-full overflow-hidden group border border-[#a200ff]/30 hover:border-[#a200ff] transition-colors duration-300 shadow-[0_0_15px_rgba(162,0,255,0.2)] hover:shadow-[0_0_25px_rgba(162,0,255,0.5)]">
          <div class="absolute inset-0 bg-gradient-to-r from-[#00f5ff] to-[#a200ff] opacity-10 group-hover:opacity-30 transition-opacity duration-300"></div>
          <span class="relative z-10 flex items-center gap-2 font-black tracking-[0.1em] uppercase text-sm text-[#00f5ff] group-hover:text-white transition-colors">
            <mat-icon class="text-[18px]">explore</mat-icon> JELAJAHI ALAT
          </span>
        </button>
      </header>

      <!-- Hero Stats Section -->
      <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 dashboard-stats">
        <div class="stat-card glass-panel p-6 rounded-3xl flex items-center gap-5 border border-white/5 relative overflow-hidden group">
          <div class="absolute right-0 top-0 w-32 h-32 bg-[#00f5ff]/5 rounded-full blur-2xl group-hover:bg-[#00f5ff]/10 transition-colors"></div>
          <div class="w-14 h-14 rounded-2xl bg-[#00f5ff]/10 border border-[#00f5ff]/20 flex items-center justify-center text-[#00f5ff] shadow-[0_0_15px_rgba(0,245,255,0.3)] z-10">
            <mat-icon>apps</mat-icon>
          </div>
          <div class="z-10">
            <div class="text-3xl font-black text-white tracking-tight">100+</div>
            <div class="text-xs font-bold uppercase tracking-widest text-gray-500">Total Tools</div>
          </div>
        </div>
        <div class="stat-card glass-panel p-6 rounded-3xl flex items-center gap-5 border border-white/5 relative overflow-hidden group">
          <div class="absolute right-0 top-0 w-32 h-32 bg-green-500/5 rounded-full blur-2xl group-hover:bg-green-500/10 transition-colors"></div>
          <div class="w-14 h-14 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.3)] z-10">
            <mat-icon>check_circle</mat-icon>
          </div>
          <div class="z-10">
            <div class="text-3xl font-black text-white tracking-tight">{{ (tasks$ | async)?.totalCompleted || 0 }}</div>
            <div class="text-xs font-bold uppercase tracking-widest text-gray-500">Tasks Done</div>
          </div>
        </div>
        <div class="stat-card glass-panel p-6 rounded-3xl flex items-center gap-5 border border-white/5 relative overflow-hidden group">
          <div class="absolute right-0 top-0 w-32 h-32 bg-[#a200ff]/5 rounded-full blur-2xl group-hover:bg-[#a200ff]/10 transition-colors"></div>
          <div class="w-14 h-14 rounded-2xl bg-[#a200ff]/10 border border-[#a200ff]/20 flex items-center justify-center text-[#a200ff] shadow-[0_0_15px_rgba(162,0,255,0.3)] z-10">
            <mat-icon>memory</mat-icon>
          </div>
          <div class="z-10">
            <div class="text-3xl font-black text-white tracking-tight">{{ (system$ | async)?.memoryUsage || 0 }}<span class="text-lg">MB</span></div>
            <div class="text-xs font-bold uppercase tracking-widest text-gray-500">RAM Usage</div>
          </div>
        </div>
        <div class="stat-card glass-panel p-6 rounded-3xl flex items-center gap-5 border border-white/5 relative overflow-hidden group">
          <div class="absolute right-0 top-0 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl group-hover:bg-orange-500/10 transition-colors"></div>
          <div class="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.3)] z-10">
            <mat-icon>storage</mat-icon>
          </div>
          <div class="z-10">
            <div class="text-3xl font-black text-white tracking-tight">4.2<span class="text-lg">GB</span></div>
            <div class="text-xs font-bold uppercase tracking-widest text-gray-500">OPFS Storage</div>
          </div>
        </div>
      </section>

      <!-- Video Titan Hub -->
      <section class="dashboard-section">
        <h2 class="text-2xl font-black mb-6 flex items-center gap-3 text-white uppercase tracking-widest">
          <mat-icon class="text-[#00f5ff] drop-shadow-[0_0_8px_rgba(0,245,255,0.6)]">movie</mat-icon> Video Titan Engine
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          @for (tool of videoTools; track tool.id) {
            <app-tool-card class="tool-card-item" [tool]="tool" basePath="video" />
          }
        </div>
      </section>

      <!-- Audio Studio Hub -->
      <section class="dashboard-section">
        <h2 class="text-2xl font-black mb-6 flex items-center gap-3 text-white uppercase tracking-widest">
          <mat-icon class="text-[#a200ff] drop-shadow-[0_0_8px_rgba(162,0,255,0.6)]">graphic_eq</mat-icon> Audio Studio Hub
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          @for (tool of audioTools; track tool.id) {
            <app-tool-card class="tool-card-item" [tool]="tool" basePath="audio" />
          }
        </div>
      </section>

      <!-- AI & Code Hub -->
      <section class="dashboard-section">
        <h2 class="text-2xl font-black mb-6 flex items-center gap-3 text-white uppercase tracking-widest">
          <mat-icon class="text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]">psychology</mat-icon> AI & Code Assist
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          @for (tool of aiTools; track tool.id) {
            <app-tool-card class="tool-card-item" [tool]="tool" [basePath]="tool.id === 'music-generator' ? 'audio' : 'anita'" />
          }
        </div>
      </section>

      <!-- System Status Monitor -->
      <section class="glass-panel rounded-3xl p-8 border border-white/5 relative overflow-hidden dashboard-section">
        <div class="absolute -right-20 -top-20 w-64 h-64 bg-green-500/5 rounded-full blur-[100px] pointer-events-none"></div>
        <h2 class="text-xl font-black mb-8 flex items-center gap-3 text-white uppercase tracking-widest">
          <mat-icon class="text-gray-400">speed</mat-icon> Core System Status
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="flex items-center justify-between p-5 rounded-2xl bg-[#0a0a0a]/80 border border-white/5 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]">
            <span class="text-xs font-bold uppercase tracking-widest text-gray-500">FFmpeg Engine</span>
            <span class="flex items-center gap-2 text-xs font-black uppercase tracking-widest" [class.text-green-400]="(system$ | async)?.ffmpegLoaded" [class.text-yellow-400]="isFfmpegStandby$ | async">
              <span class="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_currentColor]" [class.bg-green-400]="(system$ | async)?.ffmpegLoaded" [class.bg-yellow-400]="isFfmpegStandby$ | async"></span>
              {{ (system$ | async)?.ffmpegLoaded ? 'Online' : 'Standby' }}
            </span>
          </div>
          <div class="flex items-center justify-between p-5 rounded-2xl bg-[#0a0a0a]/80 border border-white/5 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]">
            <span class="text-xs font-bold uppercase tracking-widest text-gray-500">ONNX Runtime</span>
            <span class="flex items-center gap-2 text-xs font-black uppercase tracking-widest" [class.text-green-400]="(system$ | async)?.onnxLoaded" [class.text-yellow-400]="isOnnxStandby$ | async">
              <span class="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_currentColor]" [class.bg-green-400]="(system$ | async)?.onnxLoaded" [class.bg-yellow-400]="isOnnxStandby$ | async"></span>
              {{ (system$ | async)?.onnxLoaded ? 'Online' : 'Standby' }}
            </span>
          </div>
          <div class="flex items-center justify-between p-5 rounded-2xl bg-[#0a0a0a]/80 border border-white/5 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]">
            <span class="text-xs font-bold uppercase tracking-widest text-gray-500">OPFS VFS</span>
            <span class="flex items-center gap-2 text-xs font-black uppercase tracking-widest" [class.text-green-400]="(system$ | async)?.opfsAvailable" [class.text-red-500]="isOpfsUnavailable$ | async">
              <span class="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_currentColor]" [class.bg-green-400]="(system$ | async)?.opfsAvailable" [class.bg-red-500]="isOpfsUnavailable$ | async"></span>
              {{ (system$ | async)?.opfsAvailable ? 'Available' : 'Unavailable' }}
            </span>
          </div>
          <div class="flex items-center justify-between p-5 rounded-2xl bg-[#0a0a0a]/80 border border-white/5 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]">
            <span class="text-xs font-bold uppercase tracking-widest text-gray-500">Network Link</span>
            <span class="flex items-center gap-2 text-xs font-black uppercase tracking-widest" [class.text-green-400]="(system$ | async)?.networkStatus === 'online'" [class.text-red-500]="(system$ | async)?.networkStatus === 'offline'">
              <span class="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_currentColor]" [class.bg-green-400]="(system$ | async)?.networkStatus === 'online'" [class.bg-red-500]="(system$ | async)?.networkStatus === 'offline'"></span>
              {{ (system$ | async)?.networkStatus === 'online' ? 'Connected' : 'Offline' }}
            </span>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .glass-panel {
      background: rgba(255, 255, 255, 0.02);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
    }
    .glass-header {
      background: rgba(10, 10, 10, 0.6);
      backdrop-filter: blur(30px);
      -webkit-backdrop-filter: blur(30px);
      box-shadow: 0 10px 40px rgba(0,0,0,0.5);
    }
  `]
})
export class DashboardComponent {
  private store = inject(Store);
  @ViewChild('container') container!: ElementRef;
  
  system$ = this.store.select(selectSystem);
  tasks$ = this.store.select(selectTasks);

  isFfmpegStandby$ = this.system$.pipe(map(s => s?.ffmpegLoaded === false || s?.ffmpegLoaded === null || s?.ffmpegLoaded === undefined));
  isOnnxStandby$ = this.system$.pipe(map(s => s?.onnxLoaded === false || s?.onnxLoaded === null || s?.onnxLoaded === undefined));
  isOpfsUnavailable$ = this.system$.pipe(map(s => s?.opfsAvailable === false || s?.opfsAvailable === null || s?.opfsAvailable === undefined));

  videoTools: Tool[] = [
    { id: 'trimmer', label: 'Precise Trimmer', icon: 'content_cut', category: 'video', status: 'stable' },
    { id: 'upscaler', label: 'AI Upscaler', icon: 'high_quality', category: 'video', status: 'beta' },
    { id: 'stabilizer', label: 'Video Stabilizer', icon: 'vibration', category: 'video', status: 'stable' },
    { id: 'color-grading', label: 'Color Grading', icon: 'palette', category: 'video', status: 'stable' },
    { id: 'compressor', label: 'Smart Compress', icon: 'compress', category: 'video', status: 'stable' }
  ];

  audioTools: Tool[] = [
    { id: 'stem-splitter', label: 'AI Stem Splitter', icon: 'call_split', category: 'audio', status: 'beta' },
    { id: 'equalizer', label: '10-Band EQ', icon: 'tune', category: 'audio', status: 'stable' },
    { id: 'compressor', label: 'Mastering Compressor', icon: 'compress', category: 'audio', status: 'stable' },
    { id: 'noise-remover', label: 'Denoise Audio', icon: 'waves', category: 'audio', status: 'stable' },
    { id: 'mixer', label: 'Multi-track Mixer', icon: 'mic', category: 'audio', status: 'experimental' }
  ];

  aiTools: Tool[] = [
    { id: 'music-generator', label: 'AI Music Forge', icon: 'music_note', category: 'ai', status: 'experimental' },
    { id: 'chat', label: 'A.N.I.T.A Code Assist', icon: 'smart_toy', category: 'ai', status: 'beta' },
    { id: 'ocr', label: 'WASM Vision OCR', icon: 'document_scanner', category: 'image', status: 'stable' }
  ];

  constructor() {
    afterNextRender(() => {
      this.initAnimations();
    });
  }

  initAnimations() {
    if (!this.container) return;

    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    // Animate Navbar
    tl.to('.dashboard-nav', { y: 0, opacity: 1, duration: 0.8, delay: 0.1 });

    // Animate Stat Cards
    tl.fromTo('.stat-card',
      { y: 30, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.1 },
      '-=0.4'
    );

    // Animate Sections
    const sections = document.querySelectorAll('.dashboard-section');
    sections.forEach((section, index) => {
      gsap.fromTo(section,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.4 + (index * 0.15) }
      );
    });

    // Animate individual tool cards inside sections
    const cards = document.querySelectorAll('.tool-card-item');
    gsap.fromTo(cards,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.5, stagger: 0.05, ease: 'back.out(1.2)', delay: 0.6 }
    );
  }
}
