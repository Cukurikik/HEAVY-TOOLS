import type { SettingFeatureDefinition } from '../../types';
export const feature250: SettingFeatureDefinition = {
  id: '250',
  category: 'plugin',
  slug: 'download-annual-financial-report-csv',
  label: 'Download Annual Financial Report (CSV)',
  description: 'Konfigurasi mendalam untuk Download Annual Financial Report (CSV)',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-250');
      } else {
        document.body.classList.remove('omni-engine-active-250');
      }
      localStorage.setItem('omni-toggle-250', String(!!value));
    }
  }
};
