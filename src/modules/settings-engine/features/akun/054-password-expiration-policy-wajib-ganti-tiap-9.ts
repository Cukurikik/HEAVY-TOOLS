import type { SettingFeatureDefinition } from '../../types';
export const feature054: SettingFeatureDefinition = {
  id: '054',
  category: 'akun',
  slug: 'password-expiration-policy-wajib-ganti-tiap-9',
  label: 'Password Expiration Policy (Wajib ganti tiap 90 hari - Opsional)',
  description: 'Konfigurasi mendalam untuk Password Expiration Policy (Wajib ganti tiap 90 hari - Opsional)',
  inputType: 'text',
  defaultValue: '',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('omni-054-config', String(value));
    }
  }
};
