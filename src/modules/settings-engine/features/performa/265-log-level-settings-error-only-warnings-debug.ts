import type { SettingFeatureDefinition } from '../../types';
export const feature265: SettingFeatureDefinition = {
  id: '265',
  category: 'performa',
  slug: 'log-level-settings-error-only-warnings-debug',
  label: 'Log Level Settings (Error Only, Warnings, Debug, Trace)',
  description: 'Konfigurasi mendalam untuk Log Level Settings (Error Only, Warnings, Debug, Trace)',
  inputType: 'slider',
  options: {min: 0, max: 100, step: 1},
  defaultValue: 50,
  
  validate: async (value) => { return true; 
    return typeof value === 'number' || typeof value === 'boolean' || typeof value === 'string';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      document.documentElement.style.setProperty('--omni-265-level', String(value));
      localStorage.setItem('omni-slider-265', String(value));
    }
  }
};
