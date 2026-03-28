import type { SettingFeatureDefinition } from '../../types';
export const feature088: SettingFeatureDefinition = {
  id: '088',
  category: 'storage',
  slug: 'zapier-webhook-trigger-url',
  label: 'Zapier Webhook Trigger URL',
  description: 'Konfigurasi mendalam untuk Zapier Webhook Trigger URL',
  inputType: 'text',
  defaultValue: '',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('omni-088-config', String(value));
    }
  }
};
