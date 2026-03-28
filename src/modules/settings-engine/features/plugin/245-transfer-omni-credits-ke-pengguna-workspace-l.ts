import type { SettingFeatureDefinition } from '../../types';
export const feature245: SettingFeatureDefinition = {
  id: '245',
  category: 'plugin',
  slug: 'transfer-omni-credits-ke-pengguna-workspace-l',
  label: 'Transfer Omni-Credits ke pengguna / workspace lain',
  description: 'Konfigurasi mendalam untuk Transfer Omni-Credits ke pengguna / workspace lain',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-245');
      } else {
        document.body.classList.remove('omni-engine-active-245');
      }
      localStorage.setItem('omni-toggle-245', String(!!value));
    }
  }
};
