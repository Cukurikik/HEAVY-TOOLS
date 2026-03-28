import type { SettingFeatureDefinition } from '../../types';
export const feature144: SettingFeatureDefinition = {
  id: '144',
  category: 'video',
  slug: 'memory-allocation-untuk-webassembly-ffmpeg-25',
  label: 'Memory Allocation untuk WebAssembly FFmpeg (256MB, 512MB, 1GB, 2GB, 4GB)',
  description: 'Konfigurasi mendalam untuk Memory Allocation untuk WebAssembly FFmpeg (256MB, 512MB, 1GB, 2GB, 4GB)',
  inputType: 'slider',
  options: {min: 0, max: 100, step: 1},
  defaultValue: 50,
  
  validate: async (value) => { return true; 
    return typeof value === 'number' || typeof value === 'boolean' || typeof value === 'string';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      document.documentElement.style.setProperty('--omni-144-level', String(value));
      localStorage.setItem('omni-slider-144', String(value));
    }
  }
};
