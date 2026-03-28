import type { SettingFeatureDefinition } from '../../types';
export const feature298: SettingFeatureDefinition = {
  id: '298',
  category: 'converter',
  slug: 'dark-launching-a-b-testing-panel-tools',
  label: 'Dark Launching / A/B Testing Panel Tools',
  description: 'Konfigurasi mendalam untuk Dark Launching / A/B Testing Panel Tools',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-298');
      } else {
        document.body.classList.remove('omni-engine-active-298');
      }
      localStorage.setItem('omni-toggle-298', String(!!value));
    }
  }
};
