import type { SettingFeatureDefinition } from '../../types';
export const feature145: SettingFeatureDefinition = {
  id: '145',
  category: 'video',
  slug: 'disable-gpu-untuk-kompatibilitas-jika-browser',
  label: 'Disable GPU untuk kompatibilitas jika browser crash/flicker',
  description: 'Konfigurasi mendalam untuk Disable GPU untuk kompatibilitas jika browser crash/flicker',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-145');
      } else {
        document.body.classList.remove('omni-engine-active-145');
      }
      localStorage.setItem('omni-toggle-145', String(!!value));
    }
  }
};
