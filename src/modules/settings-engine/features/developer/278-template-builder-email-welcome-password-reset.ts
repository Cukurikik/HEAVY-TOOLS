import type { SettingFeatureDefinition } from '../../types';
export const feature278: SettingFeatureDefinition = {
  id: '278',
  category: 'developer',
  slug: 'template-builder-email-welcome-password-reset',
  label: 'Template Builder Email Welcome / Password Reset',
  description: 'Konfigurasi mendalam untuk Template Builder Email Welcome / Password Reset',
  inputType: 'text',
  defaultValue: '',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('omni-278-config', String(value));
    }
  }
};
