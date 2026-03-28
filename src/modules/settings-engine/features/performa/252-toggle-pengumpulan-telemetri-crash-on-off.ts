import type { SettingFeatureDefinition } from '../../types';
export const feature252: SettingFeatureDefinition = {
  id: '252',
  category: 'performa',
  slug: 'toggle-pengumpulan-telemetri-crash-on-off',
  label: 'Toggle Pengumpulan Telemetri Crash (On/Off)',
  description: 'Konfigurasi mendalam untuk Toggle Pengumpulan Telemetri Crash (On/Off)',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-252');
      } else {
        document.body.classList.remove('omni-engine-active-252');
      }
      localStorage.setItem('omni-toggle-252', String(!!value));
    }
  }
};
