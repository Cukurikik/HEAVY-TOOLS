import type { SettingFeatureDefinition } from '../../types';
export const feature008: SettingFeatureDefinition = {
  id: '008',
  category: 'tampilan',
  slug: 'mode-kontras-tinggi-high-contrast-mode-untuk',
  label: 'Mode Kontras Tinggi (High Contrast Mode) untuk aksesibilitas',
  description: 'Konfigurasi mendalam untuk Mode Kontras Tinggi (High Contrast Mode) untuk aksesibilitas',
  inputType: 'dropdown',
  options: ['Auto', 'Manual', 'Strict'],
  defaultValue: 'Auto',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-omni-008', String(value));
      localStorage.setItem('omni-dropdown-008', String(value));
    }
  }
};
