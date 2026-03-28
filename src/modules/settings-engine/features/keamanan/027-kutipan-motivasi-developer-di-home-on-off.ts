import type { SettingFeatureDefinition } from '../../types';
export const feature027: SettingFeatureDefinition = {
  id: '027',
  category: 'keamanan',
  slug: 'kutipan-motivasi-developer-di-home-on-off',
  label: 'Kutipan Motivasi Developer di Home (On/Off)',
  description: 'Konfigurasi mendalam untuk Kutipan Motivasi Developer di Home (On/Off)',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-027');
      } else {
        document.body.classList.remove('omni-engine-active-027');
      }
      localStorage.setItem('omni-toggle-027', String(!!value));
    }
  }
};
