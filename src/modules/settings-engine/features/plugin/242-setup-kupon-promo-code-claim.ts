import type { SettingFeatureDefinition } from '../../types';
export const feature242: SettingFeatureDefinition = {
  id: '242',
  category: 'plugin',
  slug: 'setup-kupon-promo-code-claim',
  label: 'Setup Kupon / Promo Code claim',
  description: 'Konfigurasi mendalam untuk Setup Kupon / Promo Code claim',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-242');
      } else {
        document.body.classList.remove('omni-engine-active-242');
      }
      localStorage.setItem('omni-toggle-242', String(!!value));
    }
  }
};
