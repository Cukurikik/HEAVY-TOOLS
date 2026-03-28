import type { SettingFeatureDefinition } from '../../types';
export const feature135: SettingFeatureDefinition = {
  id: '135',
  category: 'video',
  slug: 'hapus-file-original-setelah-terkonversi-sukse',
  label: 'Hapus File Original setelah terkonversi sukses (Hemat space disk)',
  description: 'Konfigurasi mendalam untuk Hapus File Original setelah terkonversi sukses (Hemat space disk)',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-135');
      } else {
        document.body.classList.remove('omni-engine-active-135');
      }
      localStorage.setItem('omni-toggle-135', String(!!value));
    }
  }
};
