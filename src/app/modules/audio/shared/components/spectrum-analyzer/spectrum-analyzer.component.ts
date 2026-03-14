import { ChangeDetectionStrategy, Component, ElementRef, Input, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-spectrum-analyzer',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-black/30 rounded-xl overflow-hidden border border-white/5">
      <canvas #canvas class="w-full" [style.height.px]="height"></canvas>
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
