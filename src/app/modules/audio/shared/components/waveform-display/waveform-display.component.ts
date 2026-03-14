import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ElementRef, ViewChild, AfterViewInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { WaveformData } from '../../types/audio.types';

@Component({
  selector: 'app-waveform-display',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative w-full rounded-2xl overflow-hidden bg-[#050508]/80 backdrop-blur-xl border border-white/10 shadow-[inner_0_0_30px_rgba(34,211,238,0.05)] transition-all duration-500 hover:border-cyan-500/30 hover:shadow-[0_0_30px_rgba(34,211,238,0.15)] group cursor-crosshair"
         tabindex="0"
         role="slider"
         [attr.aria-valuemin]="0"
         [attr.aria-valuemax]="waveformData?.duration || 0"
         [attr.aria-valuenow]="currentTime"
         (click)="onCanvasClick($event)"
         (keydown)="onCanvasKeydown($event)">
      
      <!-- Ambient Glow -->
      <div class="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-cyan-500/10 to-transparent pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>

      <canvas #canvas class="w-full relative z-10 transition-opacity duration-300"
              [style.height.px]="height" [class.opacity-50]="!waveformData"></canvas>
              
      @if (currentTime > 0 && waveformData) {
        <div class="absolute top-0 bottom-0 w-0.5 bg-cyan-400 z-20 pointer-events-none shadow-[0_0_15px_rgba(34,211,238,1)]"
             [style.left.%]="(currentTime / waveformData.duration) * 100">
          <div class="absolute top-0 right-0 w-2 h-2 -mt-1 -mr-[3px] rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(34,211,238,1)]"></div>
          <div class="absolute bottom-0 right-0 w-2 h-2 -mb-1 -mr-[3px] rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(34,211,238,1)]"></div>
        </div>
      }
      
      @if (!waveformData) {
        <div class="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <span class="text-xs font-medium text-white/30 tracking-widest uppercase flex items-center gap-2">
            <div class="w-1.5 h-1.5 rounded-full bg-cyan-500/50 animate-pulse"></div>
            Awaiting Audio Data
          </span>
        </div>
      }
    </div>
  `
})
export class WaveformDisplayComponent implements AfterViewInit, OnChanges {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  @Input() waveformData: WaveformData | null = null;
  @Input() currentTime = 0;
  @Input() height = 120;
  @Input() color = '#22d3ee';
  @Output() seek = new EventEmitter<number>();

  ngAfterViewInit(): void { this.draw(); }
  ngOnChanges(): void { this.draw(); }

  onCanvasClick(e: MouseEvent): void {
    if (!this.waveformData) return;
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    this.seek.emit(pct * this.waveformData.duration);
  }

  onCanvasKeydown(e: KeyboardEvent): void {
    if (!this.waveformData) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
       e.preventDefault();
       const jump = this.waveformData.duration * 0.05;
       let newTime = this.currentTime + (e.key === 'ArrowRight' ? jump : -jump);
       newTime = Math.max(0, Math.min(newTime, this.waveformData.duration));
       this.seek.emit(newTime);
    }
  }

  private draw(): void {
    if (!this.canvasRef || !this.waveformData) return;
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.clientWidth * dpr;
    canvas.height = this.height * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, canvas.clientWidth, this.height);
    const peaks = this.waveformData.peaks;
    const w = canvas.clientWidth;
    const h = this.height;
    const mid = h / 2;
    const step = w / peaks.length;
    ctx.fillStyle = this.color;
    for (let i = 0; i < peaks.length; i++) {
      const amp = peaks[i] * mid * 0.9;
      ctx.fillRect(i * step, mid - amp, Math.max(step - 0.5, 1), amp * 2);
    }
  }
}
