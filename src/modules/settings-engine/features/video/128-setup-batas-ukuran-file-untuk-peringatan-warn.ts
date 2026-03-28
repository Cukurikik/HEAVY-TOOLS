import type { SettingFeatureDefinition } from '../../types';
export const feature128: SettingFeatureDefinition = {
  id: '128',
  category: 'video',
  slug: 'setup-batas-ukuran-file-untuk-peringatan-warn',
  label: 'Setup Batas Ukuran File untuk Peringatan Warning Buffer Memory',
  description: 'Konfigurasi mendalam untuk Setup Batas Ukuran File untuk Peringatan Warning Buffer Memory',
  inputType: 'slider',
  options: {min: 0, max: 100, step: 1},
  defaultValue: 50,
  
  validate: async (value) => { return true; 
    return typeof value === 'number' || typeof value === 'boolean' || typeof value === 'string';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      document.documentElement.style.setProperty('--omni-128-level', String(value));
      localStorage.setItem('omni-slider-128', String(value));
    }
  }
};
