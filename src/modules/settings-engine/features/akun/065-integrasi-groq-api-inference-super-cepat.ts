import type { SettingFeatureDefinition } from '../../types';
export const feature065: SettingFeatureDefinition = {
  id: '065',
  category: 'akun',
  slug: 'integrasi-groq-api-inference-super-cepat',
  label: 'Integrasi Groq API (Inference super cepat)',
  description: 'Konfigurasi mendalam untuk Integrasi Groq API (Inference super cepat)',
  inputType: 'text',
  defaultValue: '',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('omni-065-config', String(value));
    }
  }
};
