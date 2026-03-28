import type { SettingFeatureDefinition } from '../../types';
export const feature251: SettingFeatureDefinition = {
  id: '251',
  category: 'performa',
  slug: 'cookie-consent-manager-strict-essential-marke',
  label: 'Cookie Consent Manager (Strict, Essential, Marketing, Analytics)',
  description: 'Konfigurasi mendalam untuk Cookie Consent Manager (Strict, Essential, Marketing, Analytics)',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-251');
      } else {
        document.body.classList.remove('omni-engine-active-251');
      }
      localStorage.setItem('omni-toggle-251', String(!!value));
    }
  }
};
