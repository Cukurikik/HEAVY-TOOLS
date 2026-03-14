import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ElementRef, ViewChild, AfterViewInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { WaveformData } from '../../types/audio.types';

@Component({
  selector: 'app-waveform-display',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative bg-black/30 rounded-xl overflow-hidden border border-white/5"
         (click)="onCanvasClick($event)" (keydown.enter)="onCanvasClick($event)" tabindex="0">
      <canvas #canvas class="w-full" [style.height.px]="height"></canvas>
      @if (currentTime > 0 && waveformData) {
        <div class="absolute top-0 bottom-0 w-px bg-cyan-400 pointer-events-none"
             [style.left.%]="(currentTime / waveformData.duration) * 100"></div>
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
