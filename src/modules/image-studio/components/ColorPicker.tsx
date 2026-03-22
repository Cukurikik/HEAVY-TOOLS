import React, { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Pipette } from 'lucide-react';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  className?: string;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange, className = '' }) => {
  const [isSupported] = useState(() => 'EyeDropper' in window);

  const handleEyedropper = async () => {
    if (!isSupported) return;
    try {
      // @ts-ignore - EyeDropper API is standard but sometimes missing in TS types
      const eyeDropper = new window.EyeDropper();
      const result = await eyeDropper.open();
      onChange(result.sRGBHex);
    } catch (e) {
      console.log('EyeDropper closed or failed', e);
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div 
        className="w-10 h-10 rounded-md shadow-sm border border-border overflow-hidden relative cursor-pointer"
        style={{ backgroundColor: color }}
      >
        <input
          type="color"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 w-[200%] h-[200%] -top-2 -left-2 opacity-0 cursor-pointer"
        />
      </div>
      <div className="flex-1 font-mono text-sm bg-muted/50 px-3 py-2 rounded-md border text-center font-medium">
        {color.toUpperCase()}
      </div>
      {isSupported && (
        <Button 
          variant="outline" 
          size="icon" 
          onClick={handleEyedropper}
          title="Pick color from screen"
        >
          <Pipette className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};