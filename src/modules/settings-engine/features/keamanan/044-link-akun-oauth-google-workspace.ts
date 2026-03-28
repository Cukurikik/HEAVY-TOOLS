import type { SettingFeatureDefinition } from '../../types';
export const feature044: SettingFeatureDefinition = {
  id: '044',
  category: 'keamanan',
  slug: 'link-akun-oauth-google-workspace',
  label: 'Link Akun OAuth: Google Workspace',
  description: 'Konfigurasi mendalam untuk Link Akun OAuth: Google Workspace',
  inputType: 'text',
  defaultValue: '',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('omni-044-config', String(value));
    }
  }
};
