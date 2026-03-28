import type { SettingFeatureDefinition } from '../../types';
export const feature037: SettingFeatureDefinition = {
  id: '037',
  category: 'keamanan',
  slug: 'manajemen-sesi-aktif-melihat-list-device-brow',
  label: 'Manajemen Sesi Aktif (Melihat list device/browser yang login)',
  description: 'Konfigurasi mendalam untuk Manajemen Sesi Aktif (Melihat list device/browser yang login)',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-037');
      } else {
        document.body.classList.remove('omni-engine-active-037');
      }
      localStorage.setItem('omni-toggle-037', String(!!value));
    }
  }
};
