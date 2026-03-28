import type { SettingFeatureDefinition } from '../../types';
export const feature275: SettingFeatureDefinition = {
  id: '275',
  category: 'performa',
  slug: 'default-signup-policy-open-registration-invit',
  label: 'Default Signup Policy (Open Registration, Invite Only, Closed)',
  description: 'Konfigurasi mendalam untuk Default Signup Policy (Open Registration, Invite Only, Closed)',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-275');
      } else {
        document.body.classList.remove('omni-engine-active-275');
      }
      localStorage.setItem('omni-toggle-275', String(!!value));
    }
  }
};
