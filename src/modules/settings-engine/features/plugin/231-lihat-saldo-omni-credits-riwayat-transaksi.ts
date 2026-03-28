import type { SettingFeatureDefinition } from '../../types';
export const feature231: SettingFeatureDefinition = {
  id: '231',
  category: 'plugin',
  slug: 'lihat-saldo-omni-credits-riwayat-transaksi',
  label: 'Lihat Saldo Omni-Credits & Riwayat Transaksi',
  description: 'Konfigurasi mendalam untuk Lihat Saldo Omni-Credits & Riwayat Transaksi',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-231');
      } else {
        document.body.classList.remove('omni-engine-active-231');
      }
      localStorage.setItem('omni-toggle-231', String(!!value));
    }
  }
};
