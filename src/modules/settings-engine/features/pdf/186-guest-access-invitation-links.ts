import type { SettingFeatureDefinition } from '../../types';
export const feature186: SettingFeatureDefinition = {
  id: '186',
  category: 'pdf',
  slug: 'guest-access-invitation-links',
  label: 'Guest Access Invitation Links',
  description: 'Konfigurasi mendalam untuk Guest Access Invitation Links',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-186');
      } else {
        document.body.classList.remove('omni-engine-active-186');
      }
      localStorage.setItem('omni-toggle-186', String(!!value));
    }
  }
};
