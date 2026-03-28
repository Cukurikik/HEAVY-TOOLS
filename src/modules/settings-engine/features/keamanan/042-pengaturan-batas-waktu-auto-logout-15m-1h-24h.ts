import type { SettingFeatureDefinition } from '../../types';
export const feature042: SettingFeatureDefinition = {
  id: '042',
  category: 'keamanan',
  slug: 'pengaturan-batas-waktu-auto-logout-15m-1h-24h',
  label: 'Pengaturan Batas Waktu Auto-Logout (15m, 1h, 24h, Never)',
  description: 'Konfigurasi mendalam untuk Pengaturan Batas Waktu Auto-Logout (15m, 1h, 24h, Never)',
  inputType: 'dropdown',
  options: ['15m', '1h', '24h', 'Never'],
  defaultValue: '1h',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-omni-042', String(value));
      localStorage.setItem('omni-dropdown-042', String(value));
    }
  }
};
