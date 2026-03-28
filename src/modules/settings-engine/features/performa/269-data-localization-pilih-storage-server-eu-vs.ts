import type { SettingFeatureDefinition } from '../../types';
export const feature269: SettingFeatureDefinition = {
  id: '269',
  category: 'performa',
  slug: 'data-localization-pilih-storage-server-eu-vs',
  label: 'Data Localization (Pilih Storage Server EU vs US vs Asia)',
  description: 'Konfigurasi mendalam untuk Data Localization (Pilih Storage Server EU vs US vs Asia)',
  inputType: 'dropdown',
  options: ['Auto', 'Manual', 'Strict'],
  defaultValue: 'Auto',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-omni-269', String(value));
      localStorage.setItem('omni-dropdown-269', String(value));
    }
  }
};
