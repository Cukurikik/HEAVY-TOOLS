import type { SettingFeatureDefinition } from '../../types';
export const feature234: SettingFeatureDefinition = {
  id: '234',
  category: 'plugin',
  slug: 'manajemen-metode-pembayaran-kartu-kredit-payp',
  label: 'Manajemen Metode Pembayaran (Kartu kredit, PayPal)',
  description: 'Konfigurasi mendalam untuk Manajemen Metode Pembayaran (Kartu kredit, PayPal)',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-234');
      } else {
        document.body.classList.remove('omni-engine-active-234');
      }
      localStorage.setItem('omni-toggle-234', String(!!value));
    }
  }
};
