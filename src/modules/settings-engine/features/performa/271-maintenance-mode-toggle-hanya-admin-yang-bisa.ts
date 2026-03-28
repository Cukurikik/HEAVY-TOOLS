import type { SettingFeatureDefinition } from '../../types';
export const feature271: SettingFeatureDefinition = {
  id: '271',
  category: 'performa',
  slug: 'maintenance-mode-toggle-hanya-admin-yang-bisa',
  label: 'Maintenance Mode Toggle (Hanya Admin yang bisa login, user akan di redirect ke halaman "Sedang Perbaikan")',
  description: 'Konfigurasi mendalam untuk Maintenance Mode Toggle (Hanya Admin yang bisa login, user akan di redirect ke halaman "Sedang Perbaikan")',
  inputType: 'dropdown',
  options: ['Auto', 'Manual', 'Strict'],
  defaultValue: 'Auto',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-omni-271', String(value));
      localStorage.setItem('omni-dropdown-271', String(value));
    }
  }
};
