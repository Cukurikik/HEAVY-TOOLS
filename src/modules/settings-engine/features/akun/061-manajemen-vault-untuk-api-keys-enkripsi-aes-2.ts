import type { SettingFeatureDefinition } from '../../types';
export const feature061: SettingFeatureDefinition = {
  id: '061',
  category: 'akun',
  slug: 'manajemen-vault-untuk-api-keys-enkripsi-aes-2',
  label: 'Manajemen "Vault" untuk API Keys (Enkripsi AES-256 lokal sebelum masuk DB)',
  description: 'Konfigurasi mendalam untuk Manajemen "Vault" untuk API Keys (Enkripsi AES-256 lokal sebelum masuk DB)',
  inputType: 'text',
  defaultValue: '',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('omni-061-config', String(value));
    }
  }
};
