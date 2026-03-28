import type { SettingFeatureDefinition } from '../../types';
export const feature031: SettingFeatureDefinition = {
  id: '031',
  category: 'keamanan',
  slug: 'manajemen-profile-page-avatar-nama-jabatan-bi',
  label: 'Manajemen Profile Page (Avatar, Nama, Jabatan, Bio)',
  description: 'Konfigurasi mendalam untuk Manajemen Profile Page (Avatar, Nama, Jabatan, Bio)',
  inputType: 'text',
  defaultValue: '',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('omni-031-config', String(value));
    }
  }
};
