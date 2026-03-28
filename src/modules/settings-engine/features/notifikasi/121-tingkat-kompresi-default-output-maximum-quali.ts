import type { SettingFeatureDefinition } from '../../types';
export const feature121: SettingFeatureDefinition = {
  id: '121',
  category: 'notifikasi',
  slug: 'tingkat-kompresi-default-output-maximum-quali',
  label: 'Tingkat Kompresi Default Output (Maximum Quality vs Maximum Speed)',
  description: 'Konfigurasi mendalam untuk Tingkat Kompresi Default Output (Maximum Quality vs Maximum Speed)',
  inputType: 'slider',
  options: {min: 0, max: 100, step: 1},
  defaultValue: 50,
  
  validate: async (value) => { return true; 
    return typeof value === 'number' || typeof value === 'boolean' || typeof value === 'string';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      document.documentElement.style.setProperty('--omni-121-level', String(value));
      localStorage.setItem('omni-slider-121', String(value));
    }
  }
};
