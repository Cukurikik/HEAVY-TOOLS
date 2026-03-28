import type { SettingFeatureDefinition } from '../../types';
export const feature183: SettingFeatureDefinition = {
  id: '183',
  category: 'pdf',
  slug: 'pengaturan-quota-per-member',
  label: 'Pengaturan Quota Per-Member',
  description: 'Konfigurasi mendalam untuk Pengaturan Quota Per-Member',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-183');
      } else {
        document.body.classList.remove('omni-engine-active-183');
      }
      localStorage.setItem('omni-toggle-183', String(!!value));
    }
  }
};
