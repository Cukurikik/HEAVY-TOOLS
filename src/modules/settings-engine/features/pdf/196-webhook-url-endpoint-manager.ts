import type { SettingFeatureDefinition } from '../../types';
export const feature196: SettingFeatureDefinition = {
  id: '196',
  category: 'pdf',
  slug: 'webhook-url-endpoint-manager',
  label: 'Webhook URL Endpoint Manager',
  description: 'Konfigurasi mendalam untuk Webhook URL Endpoint Manager',
  inputType: 'text',
  defaultValue: '',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('omni-196-config', String(value));
    }
  }
};
