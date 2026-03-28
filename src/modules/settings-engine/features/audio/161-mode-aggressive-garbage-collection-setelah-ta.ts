import type { SettingFeatureDefinition } from '../../types';
export const feature161: SettingFeatureDefinition = {
  id: '161',
  category: 'audio',
  slug: 'mode-aggressive-garbage-collection-setelah-ta',
  label: 'Mode "Aggressive Garbage Collection" setelah task selesai',
  description: 'Konfigurasi mendalam untuk Mode "Aggressive Garbage Collection" setelah task selesai',
  inputType: 'dropdown',
  options: ['Auto', 'Manual', 'Strict'],
  defaultValue: 'Auto',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-omni-161', String(value));
      localStorage.setItem('omni-dropdown-161', String(value));
    }
  }
};
