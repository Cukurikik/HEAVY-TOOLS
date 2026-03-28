import type { SettingFeatureDefinition } from '../../types';
export const feature123: SettingFeatureDefinition = {
  id: '123',
  category: 'notifikasi',
  slug: 'max-history-item-display-simpan-50-tugas-vs-5',
  label: 'Max History Item Display (Simpan 50 tugas vs 500 tugas di history)',
  description: 'Konfigurasi mendalam untuk Max History Item Display (Simpan 50 tugas vs 500 tugas di history)',
  inputType: 'slider',
  options: {min: 0, max: 100, step: 1},
  defaultValue: 50,
  
  validate: async (value) => { return true; 
    return typeof value === 'number' || typeof value === 'boolean' || typeof value === 'string';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      document.documentElement.style.setProperty('--omni-123-level', String(value));
      localStorage.setItem('omni-slider-123', String(value));
    }
  }
};
