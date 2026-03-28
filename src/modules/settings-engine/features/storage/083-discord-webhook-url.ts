import type { SettingFeatureDefinition } from '../../types';
export const feature083: SettingFeatureDefinition = {
  id: '083',
  category: 'storage',
  slug: 'discord-webhook-url',
  label: 'Discord Webhook URL',
  description: 'Konfigurasi mendalam untuk Discord Webhook URL',
  inputType: 'text',
  defaultValue: '',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('omni-083-config', String(value));
    }
  }
};
