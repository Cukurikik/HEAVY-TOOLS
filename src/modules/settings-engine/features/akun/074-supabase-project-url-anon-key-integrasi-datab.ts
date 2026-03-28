import type { SettingFeatureDefinition } from '../../types';
export const feature074: SettingFeatureDefinition = {
  id: '074',
  category: 'akun',
  slug: 'supabase-project-url-anon-key-integrasi-datab',
  label: 'Supabase Project URL & Anon Key (Integrasi database eksternal pengguna)',
  description: 'Konfigurasi mendalam untuk Supabase Project URL & Anon Key (Integrasi database eksternal pengguna)',
  inputType: 'text',
  defaultValue: '',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('omni-074-config', String(value));
    }
  }
};
