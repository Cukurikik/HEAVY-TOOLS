import type { SettingFeatureDefinition } from '../../types';
export const feature195: SettingFeatureDefinition = {
  id: '195',
  category: 'pdf',
  slug: 'webhook-event-format-json-xml',
  label: 'Webhook Event Format (JSON, XML)',
  description: 'Konfigurasi mendalam untuk Webhook Event Format (JSON, XML)',
  inputType: 'text',
  defaultValue: '',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('omni-195-config', String(value));
    }
  }
};
