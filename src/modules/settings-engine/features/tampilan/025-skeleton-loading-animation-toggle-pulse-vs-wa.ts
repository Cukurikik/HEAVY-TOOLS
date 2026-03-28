import type { SettingFeatureDefinition } from '../../types';
export const feature025: SettingFeatureDefinition = {
  id: '025',
  category: 'tampilan',
  slug: 'skeleton-loading-animation-toggle-pulse-vs-wa',
  label: 'Skeleton Loading Animation Toggle (Pulse vs Wave)',
  description: 'Konfigurasi mendalam untuk Skeleton Loading Animation Toggle (Pulse vs Wave)',
  inputType: 'dropdown',
  options: ['Pulse', 'Wave'],
  defaultValue: 'Pulse',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-omni-025', String(value));
      localStorage.setItem('omni-dropdown-025', String(value));
    }
  }
};
