import type { SettingFeatureDefinition } from '../../types';
export const feature205: SettingFeatureDefinition = {
  id: '205',
  category: 'llm',
  slug: 'payload-header-custom-injection',
  label: 'Payload Header Custom injection',
  description: 'Konfigurasi mendalam untuk Payload Header Custom injection',
  inputType: 'text',
  defaultValue: '',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('omni-205-config', String(value));
    }
  }
};
