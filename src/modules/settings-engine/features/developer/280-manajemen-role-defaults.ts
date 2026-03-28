import type { SettingFeatureDefinition } from '../../types';
export const feature280: SettingFeatureDefinition = {
  id: '280',
  category: 'developer',
  slug: 'manajemen-role-defaults',
  label: 'Manajemen Role Defaults',
  description: 'Konfigurasi mendalam untuk Manajemen Role Defaults',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-280');
      } else {
        document.body.classList.remove('omni-engine-active-280');
      }
      localStorage.setItem('omni-toggle-280', String(!!value));
    }
  }
};
