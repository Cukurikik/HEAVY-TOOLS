import type { SettingFeatureDefinition } from '../../types';
export const feature257: SettingFeatureDefinition = {
  id: '257',
  category: 'performa',
  slug: 'fitur-panic-button-burner-mode-klik-3-kali-ha',
  label: 'Fitur Panic Button/Burner Mode (Klik 3 kali hapus semua local database IndexedDB instan)',
  description: 'Konfigurasi mendalam untuk Fitur Panic Button/Burner Mode (Klik 3 kali hapus semua local database IndexedDB instan)',
  inputType: 'dropdown',
  options: ['Auto', 'Manual', 'Strict'],
  defaultValue: 'Auto',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-omni-257', String(value));
      localStorage.setItem('omni-dropdown-257', String(value));
    }
  }
};
