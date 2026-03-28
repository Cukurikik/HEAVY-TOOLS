import type { SettingFeatureDefinition } from '../../types';
export const feature266: SettingFeatureDefinition = {
  id: '266',
  category: 'performa',
  slug: 'limit-cache-log-backend',
  label: 'Limit Cache Log Backend',
  description: 'Konfigurasi mendalam untuk Limit Cache Log Backend',
  inputType: 'slider',
  options: {min: 0, max: 100, step: 1},
  defaultValue: 50,
  
  validate: async (value) => { return true; 
    return typeof value === 'number' || typeof value === 'boolean' || typeof value === 'string';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      document.documentElement.style.setProperty('--omni-266-level', String(value));
      localStorage.setItem('omni-slider-266', String(value));
    }
  }
};
