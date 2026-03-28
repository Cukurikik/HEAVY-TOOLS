import type { SettingFeatureDefinition } from '../../types';
export const feature137: SettingFeatureDefinition = {
  id: '137',
  category: 'video',
  slug: 'opsi-buka-otomatis-file-support-di-browser-ta',
  label: 'Opsi "Buka Otomatis File Support" di browser tab baru',
  description: 'Konfigurasi mendalam untuk Opsi "Buka Otomatis File Support" di browser tab baru',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-137');
      } else {
        document.body.classList.remove('omni-engine-active-137');
      }
      localStorage.setItem('omni-toggle-137', String(!!value));
    }
  }
};
