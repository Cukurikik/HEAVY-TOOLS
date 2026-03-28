import type { SettingFeatureDefinition } from '../../types';
export const feature109: SettingFeatureDefinition = {
  id: '109',
  category: 'notifikasi',
  slug: 'dashboard-analitik-penggunaan-byok-berapa-req',
  label: 'Dashboard Analitik Penggunaan BYOK (Berapa request yang dikirim bulan ini)',
  description: 'Konfigurasi mendalam untuk Dashboard Analitik Penggunaan BYOK (Berapa request yang dikirim bulan ini)',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-109');
      } else {
        document.body.classList.remove('omni-engine-active-109');
      }
      localStorage.setItem('omni-toggle-109', String(!!value));
    }
  }
};
