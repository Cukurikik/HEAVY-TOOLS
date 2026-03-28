import type { SettingFeatureDefinition } from '../../types';
export const feature064: SettingFeatureDefinition = {
  id: '064',
  category: 'akun',
  slug: 'integrasi-google-gemini-api',
  label: 'Integrasi Google Gemini API',
  description: 'Konfigurasi mendalam untuk Integrasi Google Gemini API',
  inputType: 'text',
  defaultValue: '',

  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },

  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('omni-064-config', String(value));
    }
  }
};
