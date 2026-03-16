import { ChangeDetectionStrategy, Component, ElementRef, ViewChild, inject, afterNextRender } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { selectSystem, selectTasks } from '../../store/app.selectors';
import { ToolCardComponent, Tool } from '../../shared/components/tool-card/tool-card.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatIconModule, ToolCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-8 space-y-12 max-w-7xl mx-auto" #container>
      <!-- Hero Section -->
      <section class="hero-section flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div class="space-y-4">
          <h1 class="text-5xl md:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-accent-purple">
            Omni-Tool Dashboard
          </h1>
          <p class="text-xl text-text-secondary max-w-2xl">
            Enterprise Hybrid Suite. Local-First, Cloud-Optional.
          </p>
        </div>
        <div class="glass-panel rounded-2xl p-6 flex items-center gap-6">
          <div class="text-center">
            <div class="text-sm text-text-muted uppercase tracking-wider mb-1">CPU</div>
            <div class="text-2xl font-mono text-accent-cyan">12%</div>
          </div>
          <div class="w-px h-12 bg-white/10"></div>
          <div class="text-center">
            <div class="text-sm text-text-muted uppercase tracking-wider mb-1">Memory</div>
            <div class="text-2xl font-mono text-accent-purple">{{ (system$ | async)?.memoryUsage || 0 }}MB</div>
          </div>
        </div>
      </section>

      <!-- Stats Row -->
      <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="stat-card glass-panel p-6 rounded-2xl flex items-center gap-4">
          <div class="w-12 h-12 rounded-full bg-accent-cyan/20 flex items-center justify-center text-accent-cyan">
            <mat-icon>apps</mat-icon>
          </div>
          <div>
            <div class="text-3xl font-mono font-bold">70+</div>
            <div class="text-sm text-text-secondary">Total Tools</div>
          </div>
        </div>
        <div class="stat-card glass-panel p-6 rounded-2xl flex items-center gap-4">
          <div class="w-12 h-12 rounded-full bg-status-success/20 flex items-center justify-center text-status-success">
            <mat-icon>check_circle</mat-icon>
          </div>
          <div>
            <div class="text-3xl font-mono font-bold">{{ (tasks$ | async)?.totalCompleted || 0 }}</div>
            <div class="text-sm text-text-secondary">Tasks Completed</div>
          </div>
        </div>
        <div class="stat-card glass-panel p-6 rounded-2xl flex items-center gap-4">
          <div class="w-12 h-12 rounded-full bg-accent-purple/20 flex items-center justify-center text-accent-purple">
            <mat-icon>description</mat-icon>
          </div>
          <div>
            <div class="text-3xl font-mono font-bold">1,204</div>
            <div class="text-sm text-text-secondary">Files Processed</div>
          </div>
        </div>
        <div class="stat-card glass-panel p-6 rounded-2xl flex items-center gap-4">
          <div class="w-12 h-12 rounded-full bg-status-warning/20 flex items-center justify-center text-status-warning">
            <mat-icon>storage</mat-icon>
          </div>
          <div>
            <div class="text-3xl font-mono font-bold">4.2 GB</div>
            <div class="text-sm text-text-secondary">Storage Used</div>
          </div>
        </div>
      </section>

      <!-- Quick Access Grid -->
      <section>
        <h2 class="text-2xl font-semibold mb-6 flex items-center gap-2">
          <mat-icon class="text-accent-cyan">bolt</mat-icon> Quick Access
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          @for (tool of quickTools; track tool.id) {
            <app-tool-card class="tool-card-item" [tool]="tool" />
          }
        </div>
      </section>

      <!-- System Status Panel -->
      <section class="glass-panel rounded-2xl p-8">
        <h2 class="text-2xl font-semibold mb-6 flex items-center gap-2">
          <mat-icon class="text-accent-purple">memory</mat-icon> System Status
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
            <span class="text-text-secondary">FFmpeg Engine</span>
            <span class="flex items-center gap-2 text-sm font-medium" [class.text-status-success]="(system$ | async)?.ffmpegLoaded" [class.text-status-warning]="(system$ | async)?.ffmpegLoaded === false || (system$ | async)?.ffmpegLoaded === null || (system$ | async)?.ffmpegLoaded === undefined">
              <span class="w-2 h-2 rounded-full" [class.bg-status-success]="(system$ | async)?.ffmpegLoaded" [class.bg-status-warning]="(system$ | async)?.ffmpegLoaded === false || (system$ | async)?.ffmpegLoaded === null || (system$ | async)?.ffmpegLoaded === undefined"></span>
              {{ (system$ | async)?.ffmpegLoaded ? 'Online' : 'Standby' }}
            </span>
          </div>
          <div class="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
            <span class="text-text-secondary">ONNX Runtime</span>
            <span class="flex items-center gap-2 text-sm font-medium" [class.text-status-success]="(system$ | async)?.onnxLoaded" [class.text-status-warning]="(system$ | async)?.onnxLoaded === false || (system$ | async)?.onnxLoaded === null || (system$ | async)?.onnxLoaded === undefined">
              <span class="w-2 h-2 rounded-full" [class.bg-status-success]="(system$ | async)?.onnxLoaded" [class.bg-status-warning]="(system$ | async)?.onnxLoaded === false || (system$ | async)?.onnxLoaded === null || (system$ | async)?.onnxLoaded === undefined"></span>
              {{ (system$ | async)?.onnxLoaded ? 'Online' : 'Standby' }}
            </span>
          </div>
          <div class="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
            <span class="text-text-secondary">OPFS Storage</span>
            <span class="flex items-center gap-2 text-sm font-medium" [class.text-status-success]="(system$ | async)?.opfsAvailable" [class.text-status-error]="(system$ | async)?.opfsAvailable === false || (system$ | async)?.opfsAvailable === null || (system$ | async)?.opfsAvailable === undefined">
              <span class="w-2 h-2 rounded-full" [class.bg-status-success]="(system$ | async)?.opfsAvailable" [class.bg-status-error]="(system$ | async)?.opfsAvailable === false || (system$ | async)?.opfsAvailable === null || (system$ | async)?.opfsAvailable === undefined"></span>
              {{ (system$ | async)?.opfsAvailable ? 'Available' : 'Unavailable' }}
            </span>
          </div>
          <div class="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
            <span class="text-text-secondary">Network</span>
            <span class="flex items-center gap-2 text-sm font-medium" [class.text-status-success]="(system$ | async)?.networkStatus === 'online'" [class.text-status-error]="(system$ | async)?.networkStatus === 'offline'">
              <span class="w-2 h-2 rounded-full" [class.bg-status-success]="(system$ | async)?.networkStatus === 'online'" [class.bg-status-error]="(system$ | async)?.networkStatus === 'offline'"></span>
              {{ (system$ | async)?.networkStatus === 'online' ? 'Connected' : 'Offline' }}
            </span>
          </div>
        </div>
      </section>
    </div>
  `
})
export class DashboardComponent {
  private store = inject(Store);
  @ViewChild('container') container!: ElementRef;
  
  system$ = this.store.select(selectSystem);
  tasks$ = this.store.select(selectTasks);

  quickTools: Tool[] = [
    { id: 'trim', label: 'Video Trimmer', icon: 'content_cut', category: 'basic', status: 'stable' },
    { id: 'convert', label: 'Format Converter', icon: 'sync', category: 'basic', status: 'stable' },
    { id: 'upscale', label: 'AI Upscaler', icon: 'rocket_launch', category: 'ai', status: 'experimental' },
    { id: 'denoise', label: 'AI Denoiser', icon: 'auto_awesome', category: 'ai', status: 'experimental' },
    { id: 'audio-split', label: 'Stem Splitter', icon: 'call_split', category: 'audio', status: 'beta' },
    { id: 'compress', label: 'Compressor', icon: 'compress', category: 'basic', status: 'stable' }
  ];

  constructor() {
    afterNextRender(async () => {
      // Animate elements on load using motion
      if (!this.container) return;
      const el = this.container.nativeElement;
      
      const { animate, stagger } = await import('motion');
      
      animate(
        el.querySelectorAll('.hero-section'),
        { opacity: [0, 1], y: [24, 0] },
        { duration: 0.6, ease: 'easeOut' }
      );

      animate(
        el.querySelectorAll('.stat-card'),
        { opacity: [0, 1], scale: [0.92, 1] },
        { delay: stagger(0.1, { startDelay: 0.2 }), duration: 0.5, ease: 'easeOut' }
      );

      animate(
        el.querySelectorAll('.tool-card-item'),
        { opacity: [0, 1], scale: [0.92, 1] },
        { delay: stagger(0.05, { startDelay: 0.4 }), duration: 0.4, ease: 'easeOut' }
      );
    });
  }
}
