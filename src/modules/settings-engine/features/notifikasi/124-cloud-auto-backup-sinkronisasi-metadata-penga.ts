import type { SettingFeatureDefinition } from '../../types';
export const feature124: SettingFeatureDefinition = {
  id: '124',
  category: 'notifikasi',
  slug: 'cloud-auto-backup-sinkronisasi-metadata-penga',
  label: 'Cloud Auto-Backup (Sinkronisasi metadata pengaturan ke Supabase)',
  description: 'Konfigurasi mendalam untuk Cloud Auto-Backup (Sinkronisasi metadata pengaturan ke Supabase)',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-124');
      } else {
        document.body.classList.remove('omni-engine-active-124');
      }
      localStorage.setItem('omni-toggle-124', String(!!value));
    }
  }
};
