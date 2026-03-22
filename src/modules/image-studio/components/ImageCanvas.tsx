import React, { useRef, useEffect, useState } from 'react';
import { useImageStore } from '../store/useImageStore';

interface ImageCanvasProps {
  editable?: boolean;
  className?: string;
  onPixelClick?: (color: string) => void;
}

export const ImageCanvas: React.FC<ImageCanvasProps> = ({ editable = true, className = '', onPixelClick }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageData = useImageStore((state: any) => state.imageData);
  const adjustments = useImageStore((state: any) => state.adjustments);
  const [scale, setScale] = useState(1);

  // Initial draw and setup
  useEffect(() => {
    if (!imageData || !canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Responsive scaling
    const container = containerRef.current;
    const padding = 32;
    const availableWidth = container.clientWidth - padding;
    const availableHeight = container.clientHeight - padding;

    const scaleX = availableWidth / imageData.width;
    const scaleY = availableHeight / imageData.height;
    const newScale = Math.min(scaleX, scaleY, 1);
    setScale(newScale);

    canvas.width = imageData.width;
    canvas.height = imageData.height;

    // Draw initial image data
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = imageData.width;
    tempCanvas.height = imageData.height;
    tempCanvas.getContext('2d')?.putImageData(imageData, 0, 0);

    // Apply adjustments using CSS filters for real-time preview before rendering to blob
    if (editable) {
      const filters = [];
      if (adjustments.brightness !== 0) filters.push(`brightness(${100 + adjustments.brightness}%)`);
      if (adjustments.contrast !== 0) filters.push(`contrast(${100 + adjustments.contrast}%)`);
      if (adjustments.saturation !== 0) filters.push(`saturate(${100 + adjustments.saturation}%)`);
      if (adjustments.hue !== 0) filters.push(`hue-rotate(${adjustments.hue}deg)`);
      if (adjustments.blur > 0) filters.push(`blur(${adjustments.blur}px)`);
      
      ctx.filter = filters.length > 0 ? filters.join(' ') : 'none';
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(tempCanvas, 0, 0);
    } else {
      ctx.filter = 'none';
      ctx.putImageData(imageData, 0, 0);
    }

  }, [imageData, adjustments, editable]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!onPixelClick || !canvasRef.current || !imageData) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / scale);
    const y = Math.floor((e.clientY - rect.top) / scale);
    
    // Quick pixel lookup
    if (x >= 0 && x < imageData.width && y >= 0 && y < imageData.height) {
      const idx = (y * imageData.width + x) * 4;
      const r = imageData.data[idx];
      const g = imageData.data[idx + 1];
      const b = imageData.data[idx + 2];
      const a = imageData.data[idx + 3] / 255;
      onPixelClick(`rgba(${r}, ${g}, ${b}, ${a})`);
    }
  };

  return (
    <div ref={containerRef} className={`w-full h-full flex items-center justify-center overflow-hidden bg-black/5 rounded-xl ${className}`}>
      {!imageData ? (
        <div className="text-muted-foreground animate-pulse">Waiting for image...</div>
      ) : (
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'center center',
            transition: 'transform 0.1s ease',
            cursor: onPixelClick ? 'crosshair' : 'default',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}
          className="rounded shadow-xl"
        />
      )}
    </div>
  );
};
