import type { SettingFeatureDefinition } from '../../types';
export const feature113: SettingFeatureDefinition = {
  id: '113',
  category: 'notifikasi',
  slug: 'auto-delete-temporary-files-1-jam-24-jam-7-ha',
  label: 'Auto-Delete Temporary Files (1 Jam, 24 Jam, 7 Hari, Jangan Pernah)',
  description: 'Konfigurasi mendalam untuk Auto-Delete Temporary Files (1 Jam, 24 Jam, 7 Hari, Jangan Pernah)',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-113');
      } else {
        document.body.classList.remove('omni-engine-active-113');
      }
      localStorage.setItem('omni-toggle-113', String(!!value));
    }
  }
};
