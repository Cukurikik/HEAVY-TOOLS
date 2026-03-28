import type { SettingFeatureDefinition } from '../../types';
export const feature292: SettingFeatureDefinition = {
  id: '292',
  category: 'converter',
  slug: 'log-rotation-cron-time-setup-hapus-logs-lama',
  label: 'Log Rotation Cron Time Setup (Hapus logs lama tiap 72 hari)',
  description: 'Konfigurasi mendalam untuk Log Rotation Cron Time Setup (Hapus logs lama tiap 72 hari)',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-292');
      } else {
        document.body.classList.remove('omni-engine-active-292');
      }
      localStorage.setItem('omni-toggle-292', String(!!value));
    }
  }
};
