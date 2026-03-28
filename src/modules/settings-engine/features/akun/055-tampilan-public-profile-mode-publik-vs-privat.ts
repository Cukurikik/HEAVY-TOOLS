import type { SettingFeatureDefinition } from '../../types';
export const feature055: SettingFeatureDefinition = {
  id: '055',
  category: 'akun',
  slug: 'tampilan-public-profile-mode-publik-vs-privat',
  label: 'Tampilan Public Profile (Mode Publik vs Private Workspace)',
  description: 'Konfigurasi mendalam untuk Tampilan Public Profile (Mode Publik vs Private Workspace)',
  inputType: 'dropdown',
  options: ['Auto', 'Manual', 'Strict'],
  defaultValue: 'Auto',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-omni-055', String(value));
      localStorage.setItem('omni-dropdown-055', String(value));
    }
  }
};
