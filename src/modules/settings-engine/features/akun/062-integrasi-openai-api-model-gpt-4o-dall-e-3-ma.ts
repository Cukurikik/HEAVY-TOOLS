import type { SettingFeatureDefinition } from '../../types';
export const feature062: SettingFeatureDefinition = {
  id: '062',
  category: 'akun',
  slug: 'integrasi-openai-api-model-gpt-4o-dall-e-3-ma',
  label: 'Integrasi OpenAI API (Model: GPT-4o, DALL-E 3) - Masukkan `sk-...`',
  description: 'Konfigurasi mendalam untuk Integrasi OpenAI API (Model: GPT-4o, DALL-E 3) - Masukkan `sk-...`',
  inputType: 'text',
  defaultValue: '',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('omni-062-config', String(value));
    }
  }
};
