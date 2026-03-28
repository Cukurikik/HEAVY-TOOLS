import type { SettingFeatureDefinition } from '../../types';
export const feature229: SettingFeatureDefinition = {
  id: '229',
  category: 'plugin',
  slug: 'disable-ui-injection-dari-plugin-mencegah-plu',
  label: 'Disable UI Injection dari plugin (Mencegah plugin mengubah tema web)',
  description: 'Konfigurasi mendalam untuk Disable UI Injection dari plugin (Mencegah plugin mengubah tema web)',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-229');
      } else {
        document.body.classList.remove('omni-engine-active-229');
      }
      localStorage.setItem('omni-toggle-229', String(!!value));
    }
  }
};
