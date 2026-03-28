import type { SettingFeatureDefinition } from '../../types';
export const feature175: SettingFeatureDefinition = {
  id: '175',
  category: 'audio',
  slug: 'shareable-links-settings-masa-berlaku-link-as',
  label: 'Shareable Links Settings (Masa berlaku link aset render: 1 jam, 1 hari, permanen)',
  description: 'Konfigurasi mendalam untuk Shareable Links Settings (Masa berlaku link aset render: 1 jam, 1 hari, permanen)',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-175');
      } else {
        document.body.classList.remove('omni-engine-active-175');
      }
      localStorage.setItem('omni-toggle-175', String(!!value));
    }
  }
};
