import type { SettingFeatureDefinition } from '../../types';
export const feature238: SettingFeatureDefinition = {
  id: '238',
  category: 'plugin',
  slug: 'alamat-billing-invoice-address',
  label: 'Alamat Billing (Invoice Address)',
  description: 'Konfigurasi mendalam untuk Alamat Billing (Invoice Address)',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-238');
      } else {
        document.body.classList.remove('omni-engine-active-238');
      }
      localStorage.setItem('omni-toggle-238', String(!!value));
    }
  }
};
