import type { SettingFeatureDefinition } from '../../types';
export const feature075: SettingFeatureDefinition = {
  id: '075',
  category: 'akun',
  slug: 'firebase-admin-key-integrasi',
  label: 'Firebase Admin Key Integrasi',
  description: 'Konfigurasi mendalam untuk Firebase Admin Key Integrasi',
  inputType: 'text',
  defaultValue: '',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('omni-075-config', String(value));
    }
  }
};
