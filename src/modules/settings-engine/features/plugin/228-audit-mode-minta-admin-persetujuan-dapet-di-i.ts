import type { SettingFeatureDefinition } from '../../types';
export const feature228: SettingFeatureDefinition = {
  id: '228',
  category: 'plugin',
  slug: 'audit-mode-minta-admin-persetujuan-dapet-di-i',
  label: 'Audit Mode (Minta Admin persetujuan dapet di-install)',
  description: 'Konfigurasi mendalam untuk Audit Mode (Minta Admin persetujuan dapet di-install)',
  inputType: 'dropdown',
  options: ['Auto', 'Manual', 'Strict'],
  defaultValue: 'Auto',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-omni-228', String(value));
      localStorage.setItem('omni-dropdown-228', String(value));
    }
  }
};
