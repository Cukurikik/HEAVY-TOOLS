import type { SettingFeatureDefinition } from '../../types';
export const feature056: SettingFeatureDefinition = {
  id: '056',
  category: 'akun',
  slug: 'kontak-darurat-delegasi-jika-akun-inactive-6',
  label: 'Kontak Darurat/Delegasi (Jika akun inactive 6 bulan)',
  description: 'Konfigurasi mendalam untuk Kontak Darurat/Delegasi (Jika akun inactive 6 bulan)',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-056');
      } else {
        document.body.classList.remove('omni-engine-active-056');
      }
      localStorage.setItem('omni-toggle-056', String(!!value));
    }
  }
};
