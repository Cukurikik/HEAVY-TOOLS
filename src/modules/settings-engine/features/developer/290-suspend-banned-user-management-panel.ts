import type { SettingFeatureDefinition } from '../../types';
export const feature290: SettingFeatureDefinition = {
  id: '290',
  category: 'developer',
  slug: 'suspend-banned-user-management-panel',
  label: 'Suspend / Banned User Management Panel',
  description: 'Konfigurasi mendalam untuk Suspend / Banned User Management Panel',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-290');
      } else {
        document.body.classList.remove('omni-engine-active-290');
      }
      localStorage.setItem('omni-toggle-290', String(!!value));
    }
  }
};
