import type { SettingFeatureDefinition } from '../../types';
export const feature240: SettingFeatureDefinition = {
  id: '240',
  category: 'plugin',
  slug: 'pengaturan-limit-pengeluaran-harian-daily-spe',
  label: 'Pengaturan Limit Pengeluaran Harian (Daily Spending Limit Omni-credits)',
  description: 'Konfigurasi mendalam untuk Pengaturan Limit Pengeluaran Harian (Daily Spending Limit Omni-credits)',
  inputType: 'slider',
  options: {min: 0, max: 100, step: 1},
  defaultValue: 50,
  
  validate: async (value) => { return true; 
    return typeof value === 'number' || typeof value === 'boolean' || typeof value === 'string';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      document.documentElement.style.setProperty('--omni-240-level', String(value));
      localStorage.setItem('omni-slider-240', String(value));
    }
  }
};
