import type { SettingFeatureDefinition } from '../../types';
export const feature210: SettingFeatureDefinition = {
  id: '210',
  category: 'llm',
  slug: 'revoke-all-api-tokens-panic-button',
  label: 'Revoke All API Tokens Panic Button',
  description: 'Konfigurasi mendalam untuk Revoke All API Tokens Panic Button',
  inputType: 'text',
  defaultValue: '',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('omni-210-config', String(value));
    }
  }
};
