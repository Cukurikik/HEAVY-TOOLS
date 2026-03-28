import type { SettingFeatureDefinition } from '../../types';
export const feature114: SettingFeatureDefinition = {
  id: '114',
  category: 'notifikasi',
  slug: 'maksimal-kapasitas-penyimpanan-web-opfs-limit',
  label: 'Maksimal Kapasitas Penyimpanan Web OPFS (Limit quota misal: 10GB)',
  description: 'Konfigurasi mendalam untuk Maksimal Kapasitas Penyimpanan Web OPFS (Limit quota misal: 10GB)',
  inputType: 'slider',
  options: {min: 0, max: 100, step: 1},
  defaultValue: 50,
  
  validate: async (value) => { return true; 
    return typeof value === 'number' || typeof value === 'boolean' || typeof value === 'string';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      document.documentElement.style.setProperty('--omni-114-level', String(value));
      localStorage.setItem('omni-slider-114', String(value));
    }
  }
};
