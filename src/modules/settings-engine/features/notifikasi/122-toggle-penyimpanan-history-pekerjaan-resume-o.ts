import type { SettingFeatureDefinition } from '../../types';
export const feature122: SettingFeatureDefinition = {
  id: '122',
  category: 'notifikasi',
  slug: 'toggle-penyimpanan-history-pekerjaan-resume-o',
  label: 'Toggle Penyimpanan History Pekerjaan (Resume otomatis jika browser ter-close)',
  description: 'Konfigurasi mendalam untuk Toggle Penyimpanan History Pekerjaan (Resume otomatis jika browser ter-close)',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-122');
      } else {
        document.body.classList.remove('omni-engine-active-122');
      }
      localStorage.setItem('omni-toggle-122', String(!!value));
    }
  }
};
