import type { SettingFeatureDefinition } from '../../types';
export const feature274: SettingFeatureDefinition = {
  id: '274',
  category: 'performa',
  slug: 'force-logout-all-users-globally-panic-mode-se',
  label: 'Force Logout All Users globally (Panic mode server upgrade)',
  description: 'Konfigurasi mendalam untuk Force Logout All Users globally (Panic mode server upgrade)',
  inputType: 'dropdown',
  options: ['Auto', 'Manual', 'Strict'],
  defaultValue: 'Auto',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-omni-274', String(value));
      localStorage.setItem('omni-dropdown-274', String(value));
    }
  }
};
