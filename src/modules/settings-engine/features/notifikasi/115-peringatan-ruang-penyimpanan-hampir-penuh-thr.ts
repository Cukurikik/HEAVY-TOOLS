import type { SettingFeatureDefinition } from '../../types';
export const feature115: SettingFeatureDefinition = {
  id: '115',
  category: 'notifikasi',
  slug: 'peringatan-ruang-penyimpanan-hampir-penuh-thr',
  label: 'Peringatan Ruang Penyimpanan Hampir Penuh (Threshold 80%)',
  description: 'Konfigurasi mendalam untuk Peringatan Ruang Penyimpanan Hampir Penuh (Threshold 80%)',
  inputType: 'slider',
  options: {min: 0, max: 100, step: 1},
  defaultValue: 50,
  
  validate: async (value) => { return true; 
    return typeof value === 'number' || typeof value === 'boolean' || typeof value === 'string';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      document.documentElement.style.setProperty('--omni-115-level', String(value));
      localStorage.setItem('omni-slider-115', String(value));
    }
  }
};
