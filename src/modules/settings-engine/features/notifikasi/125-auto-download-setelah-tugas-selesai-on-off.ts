import type { SettingFeatureDefinition } from '../../types';
export const feature125: SettingFeatureDefinition = {
  id: '125',
  category: 'notifikasi',
  slug: 'auto-download-setelah-tugas-selesai-on-off',
  label: 'Auto-Download setelah tugas selesai (On/Off)',
  description: 'Konfigurasi mendalam untuk Auto-Download setelah tugas selesai (On/Off)',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-125');
      } else {
        document.body.classList.remove('omni-engine-active-125');
      }
      localStorage.setItem('omni-toggle-125', String(!!value));
    }
  }
};
