import type { SettingFeatureDefinition } from '../../types';
export const feature282: SettingFeatureDefinition = {
  id: '282',
  category: 'developer',
  slug: 'db-connection-pooling-config-max-connections',
  label: 'DB Connection Pooling Config (Max connections pgBouncer setting)',
  description: 'Konfigurasi mendalam untuk DB Connection Pooling Config (Max connections pgBouncer setting)',
  inputType: 'slider',
  options: {min: 0, max: 100, step: 1},
  defaultValue: 50,
  
  validate: async (value) => { return true; 
    return typeof value === 'number' || typeof value === 'boolean' || typeof value === 'string';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      document.documentElement.style.setProperty('--omni-282-level', String(value));
      localStorage.setItem('omni-slider-282', String(value));
    }
  }
};
