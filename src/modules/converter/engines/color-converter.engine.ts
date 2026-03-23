import { ConverterTask } from '../types';

export const processColorConverter = async (task: ConverterTask, onProgress: (p: number) => void): Promise<string> => {
  onProgress(20);
  
  const input = task.options.directInput as string;
  if (!input) throw new Error("No color provided. Use HEX like #FFFFFF or RGB(255,255,255).");
  onProgress(40);

  // Simplified conversion mapping for demonstration
  let hex = input.trim();
  if (!hex.startsWith('#')) throw new Error("Currently only HEX input strings are supported (e.g. #FF5500)");

  // Convert Hex to RGB
  const r = parseInt(hex.substring(1, 3), 16);
  const g = parseInt(hex.substring(3, 5), 16);
  const b = parseInt(hex.substring(5, 7), 16);

  onProgress(80);
  
  // Calculate HSL
  let rRate = r / 255, gRate = g / 255, bRate = b / 255;
  const max = Math.max(rRate, gRate, bRate), min = Math.min(rRate, gRate, bRate);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rRate: h = (gRate - bRate) / d + (gRate < bRate ? 6 : 0); break;
      case gRate: h = (bRate - rRate) / d + 2; break;
      case bRate: h = (rRate - gRate) / d + 4; break;
    }
    h /= 6;
  }
  
  const rgbStr = `RGB(${r}, ${g}, ${b})`;
  const hslStr = `HSL(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;

  onProgress(100);
  return `${input.toUpperCase()} = ${rgbStr} = ${hslStr}`;
};
