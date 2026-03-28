import type { SettingFeatureDefinition } from '../../types';
export const feature073: SettingFeatureDefinition = {
  id: '073',
  category: 'akun',
  slug: 'google-cloud-storage-gcs-service-json-import',
  label: 'Google Cloud Storage (GCS) Service JSON Import',
  description: 'Konfigurasi mendalam untuk Google Cloud Storage (GCS) Service JSON Import',
  inputType: 'text',
  defaultValue: '',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('omni-073-config', String(value));
    }
  }
};
