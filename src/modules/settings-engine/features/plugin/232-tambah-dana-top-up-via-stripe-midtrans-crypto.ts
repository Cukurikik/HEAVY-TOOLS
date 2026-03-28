import type { SettingFeatureDefinition } from '../../types';
export const feature232: SettingFeatureDefinition = {
  id: '232',
  category: 'plugin',
  slug: 'tambah-dana-top-up-via-stripe-midtrans-crypto',
  label: 'Tambah Dana (Top Up via Stripe / Midtrans / Crypto)',
  description: 'Konfigurasi mendalam untuk Tambah Dana (Top Up via Stripe / Midtrans / Crypto)',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-232');
      } else {
        document.body.classList.remove('omni-engine-active-232');
      }
      localStorage.setItem('omni-toggle-232', String(!!value));
    }
  }
};
