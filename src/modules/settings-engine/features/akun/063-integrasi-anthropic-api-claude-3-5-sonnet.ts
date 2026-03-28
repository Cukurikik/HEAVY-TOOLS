import type { SettingFeatureDefinition } from '../../types';
export const feature063: SettingFeatureDefinition = {
  id: '063',
  category: 'akun',
  slug: 'integrasi-anthropic-api-claude-3-5-sonnet',
  label: 'Integrasi Anthropic API (Claude 3.5 Sonnet)',
  description: 'Konfigurasi mendalam untuk Integrasi Anthropic API (Claude 3.5 Sonnet)',
  inputType: 'text',
  defaultValue: '',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('omni-063-config', String(value));
    }
  }
};
