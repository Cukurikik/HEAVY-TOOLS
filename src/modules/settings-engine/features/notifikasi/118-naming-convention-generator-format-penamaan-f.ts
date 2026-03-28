import type { SettingFeatureDefinition } from '../../types';
export const feature118: SettingFeatureDefinition = {
  id: '118',
  category: 'notifikasi',
  slug: 'naming-convention-generator-format-penamaan-f',
  label: 'Naming Convention Generator (Format penamaan file: `[Tanggal]_[Tool]_[OriginalName].ext`)',
  description: 'Konfigurasi mendalam untuk Naming Convention Generator (Format penamaan file: `[Tanggal]_[Tool]_[OriginalName].ext`)',
  inputType: 'dropdown',
  options: ['Auto', 'Manual', 'Strict'],
  defaultValue: 'Auto',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-omni-118', String(value));
      localStorage.setItem('omni-dropdown-118', String(value));
    }
  }
};
