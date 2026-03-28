import type { SettingFeatureDefinition } from '../../types';
export const feature130: SettingFeatureDefinition = {
  id: '130',
  category: 'video',
  slug: 'import-setting-json-restore-dari-backup-lokal',
  label: 'Import Setting JSON (Restore dari backup lokal)',
  description: 'Konfigurasi mendalam untuk Import Setting JSON (Restore dari backup lokal)',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-130');
      } else {
        document.body.classList.remove('omni-engine-active-130');
      }
      localStorage.setItem('omni-toggle-130', String(!!value));
    }
  }
};
