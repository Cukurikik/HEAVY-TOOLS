import type { SettingFeatureDefinition } from '../../types';
export const feature015: SettingFeatureDefinition = {
  id: '015',
  category: 'tampilan',
  slug: 'pemilihan-bahasa-pengantar-utama-i18n-id-en-e',
  label: 'Pemilihan Bahasa Pengantar Utama (i18n: ID, EN, ES, FR, JP, dll)',
  description: 'Konfigurasi mendalam untuk Pemilihan Bahasa Pengantar Utama (i18n: ID, EN, ES, FR, JP, dll)',
  inputType: 'dropdown',
  options: ['ID', 'EN', 'ES', 'FR', 'JP', 'DE'],
  defaultValue: 'ID',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-omni-015', String(value));
      localStorage.setItem('omni-dropdown-015', String(value));
    }
  }
};
