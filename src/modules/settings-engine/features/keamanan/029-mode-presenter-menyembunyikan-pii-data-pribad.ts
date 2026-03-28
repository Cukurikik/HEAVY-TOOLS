import type { SettingFeatureDefinition } from '../../types';
export const feature029: SettingFeatureDefinition = {
  id: '029',
  category: 'keamanan',
  slug: 'mode-presenter-menyembunyikan-pii-data-pribad',
  label: 'Mode Presenter (Menyembunyikan PII / data pribadi saat direkam)',
  description: 'Konfigurasi mendalam untuk Mode Presenter (Menyembunyikan PII / data pribadi saat direkam)',
  inputType: 'dropdown',
  options: ['Auto', 'Manual', 'Strict'],
  defaultValue: 'Auto',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-omni-029', String(value));
      localStorage.setItem('omni-dropdown-029', String(value));
    }
  }
};
