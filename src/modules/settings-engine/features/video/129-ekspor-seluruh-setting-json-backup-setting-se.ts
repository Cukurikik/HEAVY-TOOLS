import type { SettingFeatureDefinition } from '../../types';
export const feature129: SettingFeatureDefinition = {
  id: '129',
  category: 'video',
  slug: 'ekspor-seluruh-setting-json-backup-setting-se',
  label: 'Ekspor Seluruh Setting JSON (Backup setting secara lokal)',
  description: 'Konfigurasi mendalam untuk Ekspor Seluruh Setting JSON (Backup setting secara lokal)',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-129');
      } else {
        document.body.classList.remove('omni-engine-active-129');
      }
      localStorage.setItem('omni-toggle-129', String(!!value));
    }
  }
};
