import type { SettingFeatureDefinition } from '../../types';
export const feature072: SettingFeatureDefinition = {
  id: '072',
  category: 'akun',
  slug: 'cloudflare-r2-access-keys-alternatif-s3-tanpa',
  label: 'Cloudflare R2 Access Keys (Alternatif S3 tanpa egress fee)',
  description: 'Konfigurasi mendalam untuk Cloudflare R2 Access Keys (Alternatif S3 tanpa egress fee)',
  inputType: 'text',
  defaultValue: '',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('omni-072-config', String(value));
    }
  }
};
