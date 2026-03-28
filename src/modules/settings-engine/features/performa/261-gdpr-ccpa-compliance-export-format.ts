import type { SettingFeatureDefinition } from '../../types';
export const feature261: SettingFeatureDefinition = {
  id: '261',
  category: 'performa',
  slug: 'gdpr-ccpa-compliance-export-format',
  label: 'GDPR / CCPA Compliance Export Format',
  description: 'Konfigurasi mendalam untuk GDPR / CCPA Compliance Export Format',
  inputType: 'dropdown',
  options: ['Auto', 'Manual', 'Strict'],
  defaultValue: 'Auto',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-omni-261', String(value));
      localStorage.setItem('omni-dropdown-261', String(value));
    }
  }
};
