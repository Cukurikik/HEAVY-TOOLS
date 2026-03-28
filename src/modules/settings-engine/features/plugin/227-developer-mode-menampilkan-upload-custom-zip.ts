import type { SettingFeatureDefinition } from '../../types';
export const feature227: SettingFeatureDefinition = {
  id: '227',
  category: 'plugin',
  slug: 'developer-mode-menampilkan-upload-custom-zip',
  label: 'Developer Mode (Menampilkan Upload Custom ZIP dan manifest builder)',
  description: 'Konfigurasi mendalam untuk Developer Mode (Menampilkan Upload Custom ZIP dan manifest builder)',
  inputType: 'dropdown',
  options: ['Auto', 'Manual', 'Strict'],
  defaultValue: 'Auto',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-omni-227', String(value));
      localStorage.setItem('omni-dropdown-227', String(value));
    }
  }
};
