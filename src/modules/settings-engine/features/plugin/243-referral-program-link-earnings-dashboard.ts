import type { SettingFeatureDefinition } from '../../types';
export const feature243: SettingFeatureDefinition = {
  id: '243',
  category: 'plugin',
  slug: 'referral-program-link-earnings-dashboard',
  label: 'Referral Program Link / Earnings Dashboard',
  description: 'Konfigurasi mendalam untuk Referral Program Link / Earnings Dashboard',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-243');
      } else {
        document.body.classList.remove('omni-engine-active-243');
      }
      localStorage.setItem('omni-toggle-243', String(!!value));
    }
  }
};
