import type { SettingFeatureDefinition } from '../../types';
export const feature143: SettingFeatureDefinition = {
  id: '143',
  category: 'video',
  slug: 'prioritas-cpu-web-worker-background-vs-foregr',
  label: 'Prioritas CPU Web Worker (Background vs Foreground)',
  description: 'Konfigurasi mendalam untuk Prioritas CPU Web Worker (Background vs Foreground)',
  inputType: 'dropdown',
  options: ['Auto', 'Manual', 'Strict'],
  defaultValue: 'Auto',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-omni-143', String(value));
      localStorage.setItem('omni-dropdown-143', String(value));
    }
  }
};
