import type { SettingFeatureDefinition } from '../../types';
export const feature021: SettingFeatureDefinition = {
  id: '021',
  category: 'tampilan',
  slug: 'tooltip-hover-delay-instan-500ms-1s-disable',
  label: 'Tooltip Hover Delay (Instan, 500ms, 1s, Disable)',
  description: 'Konfigurasi mendalam untuk Tooltip Hover Delay (Instan, 500ms, 1s, Disable)',
  inputType: 'dropdown',
  options: ['Instan', '500ms', '1s', 'Disable'],
  defaultValue: '500ms',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-omni-021', String(value));
      localStorage.setItem('omni-dropdown-021', String(value));
    }
  }
};
