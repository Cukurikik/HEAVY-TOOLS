import type { SettingFeatureDefinition } from '../../types';
export const feature288: SettingFeatureDefinition = {
  id: '288',
  category: 'developer',
  slug: 'manage-static-assets-cache-control-headers',
  label: 'Manage Static Assets Cache Control Headers',
  description: 'Konfigurasi mendalam untuk Manage Static Assets Cache Control Headers',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-288');
      } else {
        document.body.classList.remove('omni-engine-active-288');
      }
      localStorage.setItem('omni-toggle-288', String(!!value));
    }
  }
};
