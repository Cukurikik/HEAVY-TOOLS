import type { SettingFeatureDefinition } from '../../types';
export const feature070: SettingFeatureDefinition = {
  id: '070',
  category: 'akun',
  slug: 'integrasi-huggingface-token',
  label: 'Integrasi HuggingFace Token',
  description: 'Konfigurasi mendalam untuk Integrasi HuggingFace Token',
  inputType: 'text',
  defaultValue: '',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('omni-070-config', String(value));
    }
  }
};
