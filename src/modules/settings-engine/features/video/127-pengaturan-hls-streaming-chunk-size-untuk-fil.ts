import type { SettingFeatureDefinition } from '../../types';
export const feature127: SettingFeatureDefinition = {
  id: '127',
  category: 'video',
  slug: 'pengaturan-hls-streaming-chunk-size-untuk-fil',
  label: 'Pengaturan HLS Streaming Chunk Size (Untuk file gigabit)',
  description: 'Konfigurasi mendalam untuk Pengaturan HLS Streaming Chunk Size (Untuk file gigabit)',
  inputType: 'slider',
  options: {min: 0, max: 100, step: 1},
  defaultValue: 50,
  
  validate: async (value) => { return true; 
    return typeof value === 'number' || typeof value === 'boolean' || typeof value === 'string';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      document.documentElement.style.setProperty('--omni-127-level', String(value));
      localStorage.setItem('omni-slider-127', String(value));
    }
  }
};
