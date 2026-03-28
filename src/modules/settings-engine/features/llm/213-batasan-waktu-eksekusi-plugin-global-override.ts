import type { SettingFeatureDefinition } from '../../types';
export const feature213: SettingFeatureDefinition = {
  id: '213',
  category: 'llm',
  slug: 'batasan-waktu-eksekusi-plugin-global-override',
  label: 'Batasan Waktu Eksekusi Plugin Global (Override 10s menjadi custom 30s max)',
  description: 'Konfigurasi mendalam untuk Batasan Waktu Eksekusi Plugin Global (Override 10s menjadi custom 30s max)',
  inputType: 'slider',
  options: {min: 0, max: 100, step: 1},
  defaultValue: 50,
  
  validate: async (value) => { return true; 
    return typeof value === 'number' || typeof value === 'boolean' || typeof value === 'string';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      document.documentElement.style.setProperty('--omni-213-level', String(value));
      localStorage.setItem('omni-slider-213', String(value));
    }
  }
};
