import type { SettingFeatureDefinition } from '../../types';
export const feature142: SettingFeatureDefinition = {
  id: '142',
  category: 'video',
  slug: 'jumlah-maksimal-web-worker-pool-auto-os-cores',
  label: 'Jumlah Maksimal Web Worker Pool (Auto [OS Cores - 1] atau Manual 1-32 thread)',
  description: 'Konfigurasi mendalam untuk Jumlah Maksimal Web Worker Pool (Auto [OS Cores - 1] atau Manual 1-32 thread)',
  inputType: 'slider',
  options: {min: 0, max: 100, step: 1},
  defaultValue: 50,
  
  validate: async (value) => { return true; 
    return typeof value === 'number' || typeof value === 'boolean' || typeof value === 'string';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      document.documentElement.style.setProperty('--omni-142-level', String(value));
      localStorage.setItem('omni-slider-142', String(value));
    }
  }
};
