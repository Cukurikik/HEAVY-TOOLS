import React, { useRef, useState, useEffect } from 'react';

interface BeforeAfterSliderProps {
  beforeImage: string | Blob;
  afterImage: string | Blob;
  className?: string;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({ beforeImage, afterImage, className = '' }) => {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const beforeUrl = typeof beforeImage === 'string' ? beforeImage : URL.createObjectURL(beforeImage);
  const afterUrl = typeof afterImage === 'string' ? afterImage : URL.createObjectURL(afterImage);

  // Cleanup object URLs if they were Blobs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (typeof beforeImage !== 'string') URL.revokeObjectURL(beforeUrl);
      if (typeof afterImage !== 'string') URL.revokeObjectURL(afterUrl);
    };
  }, [beforeImage, afterImage, beforeUrl, afterUrl]);

  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    updateSliderPosition(e.clientX);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    updateSliderPosition(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDragging.current = false;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  const updateSliderPosition = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderPos(percent);
  };

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-[500px] overflow-hidden rounded-xl border select-none group touch-none cursor-ew-resize ${className}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* After image (Base layer) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img 
        src={afterUrl} 
        alt="After" 
        className="absolute inset-0 w-full h-full object-contain pointer-events-none" 
      />
      
      {/* Before image (Clipped layer) */}
      <div 
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={beforeUrl} 
          alt="Before" 
          className="absolute inset-0 w-full h-full object-contain pointer-events-none" 
        />
      </div>

      {/* Slider Handle */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize pointer-events-none shadow-[0_0_10px_rgba(0,0,0,0.5)] z-10"
        style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white border border-gray-200 rounded-full shadow-lg flex items-center justify-center transition-transform group-hover:scale-110">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
            <polyline points="15 18 9 12 15 6" />
            <polyline points="9 18 15 12 9 6" className="opacity-0" />
            <polyline points="19 12 5 12" className="opacity-0" />
            <path d="M11 18l-6-6 6-6" />
            <path d="M13 6l6 6-6 6" />
          </svg>
        </div>
      </div>
      
      <div className="absolute bottom-4 left-4 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm shadow pointer-events-none">Before</div>
      <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm shadow pointer-events-none">After</div>
    </div>
  );
};
