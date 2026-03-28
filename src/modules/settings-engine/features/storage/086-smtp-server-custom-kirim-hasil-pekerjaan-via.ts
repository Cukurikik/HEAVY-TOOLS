import type { SettingFeatureDefinition } from '../../types';
export const feature086: SettingFeatureDefinition = {
  id: '086',
  category: 'storage',
  slug: 'smtp-server-custom-kirim-hasil-pekerjaan-via',
  label: 'SMTP Server Custom (Kirim hasil pekerjaan via Email bawaan pengguna)',
  description: 'Konfigurasi mendalam untuk SMTP Server Custom (Kirim hasil pekerjaan via Email bawaan pengguna)',
  inputType: 'text',
  defaultValue: '',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('omni-086-config', String(value));
    }
  }
};
