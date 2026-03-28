import type { SettingFeatureDefinition } from '../../types';
export const feature051: SettingFeatureDefinition = {
  id: '051',
  category: 'akun',
  slug: 'request-export-data-personal-data-portability',
  label: 'Request Export Data Personal (Data Portability ZIP)',
  description: 'Konfigurasi mendalam untuk Request Export Data Personal (Data Portability ZIP)',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-051');
      } else {
        document.body.classList.remove('omni-engine-active-051');
      }
      localStorage.setItem('omni-toggle-051', String(!!value));
    }
  }
};
