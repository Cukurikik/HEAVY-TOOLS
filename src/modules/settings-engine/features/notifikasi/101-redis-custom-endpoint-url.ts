import type { SettingFeatureDefinition } from '../../types';
export const feature101: SettingFeatureDefinition = {
  id: '101',
  category: 'notifikasi',
  slug: 'redis-custom-endpoint-url',
  label: 'Redis Custom Endpoint/URL',
  description: 'Konfigurasi mendalam untuk Redis Custom Endpoint/URL',
  inputType: 'text',
  defaultValue: '',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('omni-101-config', String(value));
    }
  }
};
