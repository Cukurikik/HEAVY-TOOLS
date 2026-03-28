import type { SettingFeatureDefinition } from '../../types';
export const feature297: SettingFeatureDefinition = {
  id: '297',
  category: 'converter',
  slug: 'setup-affiliate-code-parameter-percentage-tra',
  label: 'Setup Affiliate Code Parameter & Percentage Tracking',
  description: 'Konfigurasi mendalam untuk Setup Affiliate Code Parameter & Percentage Tracking',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-297');
      } else {
        document.body.classList.remove('omni-engine-active-297');
      }
      localStorage.setItem('omni-toggle-297', String(!!value));
    }
  }
};
