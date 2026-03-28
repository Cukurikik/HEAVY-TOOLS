import type { SettingFeatureDefinition } from '../../types';
export const feature172: SettingFeatureDefinition = {
  id: '172',
  category: 'audio',
  slug: 'ganti-nama-logo-workspace',
  label: 'Ganti Nama & Logo Workspace',
  description: 'Konfigurasi mendalam untuk Ganti Nama & Logo Workspace',
  inputType: 'text',
  defaultValue: '',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('omni-172-config', String(value));
    }
  }
};
