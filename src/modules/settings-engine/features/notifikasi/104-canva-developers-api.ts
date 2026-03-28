import type { SettingFeatureDefinition } from '../../types';
export const feature104: SettingFeatureDefinition = {
  id: '104',
  category: 'notifikasi',
  slug: 'canva-developers-api',
  label: 'Canva Developers API',
  description: 'Konfigurasi mendalam untuk Canva Developers API',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-104');
      } else {
        document.body.classList.remove('omni-engine-active-104');
      }
      localStorage.setItem('omni-toggle-104', String(!!value));
    }
  }
};
