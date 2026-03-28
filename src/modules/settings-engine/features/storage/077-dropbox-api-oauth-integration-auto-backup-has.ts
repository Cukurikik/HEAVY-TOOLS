import type { SettingFeatureDefinition } from '../../types';
export const feature077: SettingFeatureDefinition = {
  id: '077',
  category: 'storage',
  slug: 'dropbox-api-oauth-integration-auto-backup-has',
  label: 'Dropbox API OAuth Integration (Auto-backup hasil render)',
  description: 'Konfigurasi mendalam untuk Dropbox API OAuth Integration (Auto-backup hasil render)',
  inputType: 'text',
  defaultValue: '',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('omni-077-config', String(value));
    }
  }
};
