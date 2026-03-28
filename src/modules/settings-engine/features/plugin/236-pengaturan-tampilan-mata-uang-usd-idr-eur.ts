import type { SettingFeatureDefinition } from '../../types';
export const feature236: SettingFeatureDefinition = {
  id: '236',
  category: 'plugin',
  slug: 'pengaturan-tampilan-mata-uang-usd-idr-eur',
  label: 'Pengaturan Tampilan Mata Uang (USD, IDR, EUR)',
  description: 'Konfigurasi mendalam untuk Pengaturan Tampilan Mata Uang (USD, IDR, EUR)',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-236');
      } else {
        document.body.classList.remove('omni-engine-active-236');
      }
      localStorage.setItem('omni-toggle-236', String(!!value));
    }
  }
};
