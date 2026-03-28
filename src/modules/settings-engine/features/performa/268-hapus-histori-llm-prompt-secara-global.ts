import type { SettingFeatureDefinition } from '../../types';
export const feature268: SettingFeatureDefinition = {
  id: '268',
  category: 'performa',
  slug: 'hapus-histori-llm-prompt-secara-global',
  label: 'Hapus Histori LLM Prompt secara Global',
  description: 'Konfigurasi mendalam untuk Hapus Histori LLM Prompt secara Global',
  inputType: 'text',
  defaultValue: '',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('omni-268-config', String(value));
    }
  }
};
