import { ChangeDetectionStrategy, Component, ElementRef, Input, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-spectrum-analyzer',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative w-full rounded-2xl overflow-hidden bg-[#050508]/80 backdrop-blur-xl border border-white/10 shadow-[inset_0_0_20px_rgba(34,211,238,0.05)] transition-all duration-500 hover:border-cyan-500/30 hover:shadow-[0_0_30px_rgba(34,211,238,0.1)] group">
      <!-- Glow Accent -->
      <div class="absolute inset-0 bg-gradient-to-t from-cyan-500/5 to-transparent pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <canvas #canvas class="w-full relative z-10 transition-opacity duration-300" 
              [style.height.px]="height"
              [class.opacity-50]="!analyserNode"
              [class.opacity-100]="analyserNode"></canvas>
              
      @if (!analyserNode) {
        <div class="absolute inset-0 flex items-center justify-center z-20">
          <span class="text-xs font-medium text-white/30 tracking-widest uppercase flex items-center gap-2">
            <div class="w-1.5 h-1.5 rounded-full bg-cyan-500/50 animate-pulse"></div>
            Awaiting Signal
          </span>
        </div>
      }
    </div>
  `
})
export class SpectrumAnalyzerComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  @Input() analyserNode: AnalyserNode | null = null;
  @Input() height = 100;
  private animId = 0;

  ngAfterViewInit(): void { this.startDraw(); }
  ngOnDestroy(): void { cancelAnimationFrame(this.animId); }

  private startDraw(): void {
    if (!this.analyserNode || !this.canvasRef) return;
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const analyser = this.analyserNode;
    const bufLen = analyser.frequencyBinCount;
    const data = new Uint8Array(bufLen);
    const draw = () => {
      this.animId = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(data);
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = this.height * dpr;
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, canvas.clientWidth, this.height);
      const barW = canvas.clientWidth / bufLen * 2;
      for (let i = 0; i < bufLen; i++) {
        const barH = (data[i] / 255) * this.height;
        const hue = (i / bufLen) * 200 + 180;
        ctx.fillStyle = `hsl(${hue}, 80%, 60%)`;
        ctx.fillRect(i * barW, this.height - barH, barW - 1, barH);
      }
    };
    draw();
  }
}
