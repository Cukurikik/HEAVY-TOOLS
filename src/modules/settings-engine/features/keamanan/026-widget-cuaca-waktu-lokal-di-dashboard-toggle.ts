import type { SettingFeatureDefinition } from '../../types';
export const feature026: SettingFeatureDefinition = {
  id: '026',
  category: 'keamanan',
  slug: 'widget-cuaca-waktu-lokal-di-dashboard-toggle',
  label: 'Widget Cuaca/Waktu Lokal di Dashboard (Toggle)',
  description: 'Konfigurasi mendalam untuk Widget Cuaca/Waktu Lokal di Dashboard (Toggle)',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-026');
      } else {
        document.body.classList.remove('omni-engine-active-026');
      }
      localStorage.setItem('omni-toggle-026', String(!!value));
    }
  }
};
