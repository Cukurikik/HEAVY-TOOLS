import type { SettingFeatureDefinition } from '../../types';
export const feature028: SettingFeatureDefinition = {
  id: '028',
  category: 'keamanan',
  slug: 'indikator-status-server-di-navbar-ping-ms',
  label: 'Indikator Status Server di Navbar (Ping ms)',
  description: 'Konfigurasi mendalam untuk Indikator Status Server di Navbar (Ping ms)',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-028');
      } else {
        document.body.classList.remove('omni-engine-active-028');
      }
      localStorage.setItem('omni-toggle-028', String(!!value));
    }
  }
};
