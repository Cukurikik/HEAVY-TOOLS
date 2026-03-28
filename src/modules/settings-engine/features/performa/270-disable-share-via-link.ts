import type { SettingFeatureDefinition } from '../../types';
export const feature270: SettingFeatureDefinition = {
  id: '270',
  category: 'performa',
  slug: 'disable-share-via-link',
  label: 'Disable "Share via Link"',
  description: 'Konfigurasi mendalam untuk Disable "Share via Link"',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-270');
      } else {
        document.body.classList.remove('omni-engine-active-270');
      }
      localStorage.setItem('omni-toggle-270', String(!!value));
    }
  }
};
