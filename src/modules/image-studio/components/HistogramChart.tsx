import React, { useEffect, useRef } from 'react';

interface HistogramChartProps {
  imageData: ImageData | null;
  className?: string;
}

export const HistogramChart: React.FC<HistogramChartProps> = ({ imageData, className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!imageData || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Calculate histogram
    const r = new Array(256).fill(0);
    const g = new Array(256).fill(0);
    const b = new Array(256).fill(0);
    
    const data = imageData.data;
    // Sample every 4th pixel for performance on large images
    for (let i = 0; i < data.length; i += 16) {
      r[data[i]]++;
      g[data[i + 1]]++;
      b[data[i + 2]]++;
    }

    const max = Math.max(...r, ...g, ...b);
    
    // Draw
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'screen';
    
    const drawChannel = (hist: number[], color: string) => {
      ctx.beginPath();
      ctx.moveTo(0, canvas.height);
      for (let i = 0; i < 256; i++) {
        const x = (i / 255) * canvas.width;
        const y = canvas.height - (hist[i] / max) * canvas.height;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(canvas.width, canvas.height);
      ctx.fillStyle = color;
      ctx.fill();
    };

    drawChannel(r, 'rgba(255, 0, 0, 0.5)');
    drawChannel(g, 'rgba(0, 255, 0, 0.5)');
    drawChannel(b, 'rgba(0, 0, 255, 0.5)');
    
  }, [imageData]);

  return (
    <div className={`p-4 bg-background border rounded-xl shadow-sm flex flex-col gap-2 ${className}`}>
      <h3 className="text-sm font-semibold tracking-tight">RGB Histogram</h3>
      <div className="relative w-full h-32 bg-black/5 rounded-md overflow-hidden dark:bg-black/20">
        <canvas
          ref={canvasRef}
          width={256}
          height={100}
          className="absolute inset-0 w-full h-full"
        />
        {/* Grid lines */}
        <div className="absolute inset-x-0 bottom-[25%] border-t border-border/40" />
        <div className="absolute inset-x-0 bottom-[50%] border-t border-border/40" />
        <div className="absolute inset-x-0 bottom-[75%] border-t border-border/40" />
      </div>
      <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
        <span>0</span>
        <span>255</span>
      </div>
    </div>
  );
};
