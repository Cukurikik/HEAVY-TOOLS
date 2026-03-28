import type { SettingFeatureDefinition } from '../../types';
export const feature089: SettingFeatureDefinition = {
  id: '089',
  category: 'storage',
  slug: 'make-com-integromat-webhook',
  label: 'Make.com (Integromat) Webhook',
  description: 'Konfigurasi mendalam untuk Make.com (Integromat) Webhook',
  inputType: 'text',
  defaultValue: '',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('omni-089-config', String(value));
    }
  }
};
