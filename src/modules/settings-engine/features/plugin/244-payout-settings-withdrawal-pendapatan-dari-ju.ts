import type { SettingFeatureDefinition } from '../../types';
export const feature244: SettingFeatureDefinition = {
  id: '244',
  category: 'plugin',
  slug: 'payout-settings-withdrawal-pendapatan-dari-ju',
  label: 'Payout Settings (Withdrawal pendapatan dari jual plugin via Stripe Connect)',
  description: 'Konfigurasi mendalam untuk Payout Settings (Withdrawal pendapatan dari jual plugin via Stripe Connect)',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-244');
      } else {
        document.body.classList.remove('omni-engine-active-244');
      }
      localStorage.setItem('omni-toggle-244', String(!!value));
    }
  }
};
