import type { SettingFeatureDefinition } from '../../types';
export const feature253: SettingFeatureDefinition = {
  id: '253',
  category: 'performa',
  slug: 'do-not-track-dnt-header-respect-toggle',
  label: 'Do Not Track (DNT) Header respect toggle',
  description: 'Konfigurasi mendalam untuk Do Not Track (DNT) Header respect toggle',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-253');
      } else {
        document.body.classList.remove('omni-engine-active-253');
      }
      localStorage.setItem('omni-toggle-253', String(!!value));
    }
  }
};
