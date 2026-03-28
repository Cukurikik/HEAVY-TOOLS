import type { SettingFeatureDefinition } from '../../types';
export const feature209: SettingFeatureDefinition = {
  id: '209',
  category: 'llm',
  slug: 'pengaturan-token-expiry-duration',
  label: 'Pengaturan Token Expiry duration',
  description: 'Konfigurasi mendalam untuk Pengaturan Token Expiry duration',
  inputType: 'text',
  defaultValue: '',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('omni-209-config', String(value));
    }
  }
};
