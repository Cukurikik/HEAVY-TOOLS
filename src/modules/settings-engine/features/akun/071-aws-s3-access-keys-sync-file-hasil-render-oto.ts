import type { SettingFeatureDefinition } from '../../types';
export const feature071: SettingFeatureDefinition = {
  id: '071',
  category: 'akun',
  slug: 'aws-s3-access-keys-sync-file-hasil-render-oto',
  label: 'AWS S3 Access Keys (Sync file hasil render otomatis ke bucket sendiri)',
  description: 'Konfigurasi mendalam untuk AWS S3 Access Keys (Sync file hasil render otomatis ke bucket sendiri)',
  inputType: 'text',
  defaultValue: '',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('omni-071-config', String(value));
    }
  }
};
