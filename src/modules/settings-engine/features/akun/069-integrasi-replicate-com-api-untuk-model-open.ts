import type { SettingFeatureDefinition } from '../../types';
export const feature069: SettingFeatureDefinition = {
  id: '069',
  category: 'akun',
  slug: 'integrasi-replicate-com-api-untuk-model-open',
  label: 'Integrasi Replicate.com API (Untuk model Open Source Bawaan)',
  description: 'Konfigurasi mendalam untuk Integrasi Replicate.com API (Untuk model Open Source Bawaan)',
  inputType: 'text',
  defaultValue: '',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('omni-069-config', String(value));
    }
  }
};
