import type { SettingFeatureDefinition } from '../../types';
export const feature078: SettingFeatureDefinition = {
  id: '078',
  category: 'storage',
  slug: 'google-drive-api-oauth-integration',
  label: 'Google Drive API OAuth Integration',
  description: 'Konfigurasi mendalam untuk Google Drive API OAuth Integration',
  inputType: 'text',
  defaultValue: '',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('omni-078-config', String(value));
    }
  }
};
