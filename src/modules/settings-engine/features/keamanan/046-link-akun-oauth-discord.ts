import type { SettingFeatureDefinition } from '../../types';
export const feature046: SettingFeatureDefinition = {
  id: '046',
  category: 'keamanan',
  slug: 'link-akun-oauth-discord',
  label: 'Link Akun OAuth: Discord',
  description: 'Konfigurasi mendalam untuk Link Akun OAuth: Discord',
  inputType: 'text',
  defaultValue: '',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('omni-046-config', String(value));
    }
  }
};
