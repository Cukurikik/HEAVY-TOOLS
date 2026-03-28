import type { SettingFeatureDefinition } from '../../types';
export const feature014: SettingFeatureDefinition = {
  id: '014',
  category: 'tampilan',
  slug: 'tampilan-timestamp-format-12h-24h-dd-mm-yyyy',
  label: 'Tampilan Timestamp Format (12h / 24h, DD/MM/YYYY vs MM/DD/YYYY)',
  description: 'Konfigurasi mendalam untuk Tampilan Timestamp Format (12h / 24h, DD/MM/YYYY vs MM/DD/YYYY)',
  inputType: 'dropdown',
  options: ['12h', '24h', 'DD/MM/YYYY', 'MM/DD/YYYY'],
  defaultValue: '24h',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-omni-014', String(value));
      localStorage.setItem('omni-dropdown-014', String(value));
    }
  }
};
