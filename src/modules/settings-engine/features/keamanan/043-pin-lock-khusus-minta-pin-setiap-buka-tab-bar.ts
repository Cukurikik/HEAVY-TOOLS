import type { SettingFeatureDefinition } from '../../types';
export const feature043: SettingFeatureDefinition = {
  id: '043',
  category: 'keamanan',
  slug: 'pin-lock-khusus-minta-pin-setiap-buka-tab-bar',
  label: 'PIN Lock Khusus (Minta PIN setiap buka tab baru)',
  description: 'Konfigurasi mendalam untuk PIN Lock Khusus (Minta PIN setiap buka tab baru)',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-043');
      } else {
        document.body.classList.remove('omni-engine-active-043');
      }
      localStorage.setItem('omni-toggle-043', String(!!value));
    }
  }
};
