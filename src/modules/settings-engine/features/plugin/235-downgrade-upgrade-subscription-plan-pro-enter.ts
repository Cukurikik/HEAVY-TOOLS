import type { SettingFeatureDefinition } from '../../types';
export const feature235: SettingFeatureDefinition = {
  id: '235',
  category: 'plugin',
  slug: 'downgrade-upgrade-subscription-plan-pro-enter',
  label: 'Downgrade / Upgrade Subscription Plan (Pro, Enterprise)',
  description: 'Konfigurasi mendalam untuk Downgrade / Upgrade Subscription Plan (Pro, Enterprise)',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-235');
      } else {
        document.body.classList.remove('omni-engine-active-235');
      }
      localStorage.setItem('omni-toggle-235', String(!!value));
    }
  }
};
