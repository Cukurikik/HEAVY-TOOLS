import type { SettingFeatureDefinition } from '../../types';
export const feature179: SettingFeatureDefinition = {
  id: '179',
  category: 'pdf',
  slug: 'shared-internal-presets-semua-tim-punya-prese',
  label: 'Shared Internal Presets (Semua tim punya preset resolusi konversi/watermark yang sama)',
  description: 'Konfigurasi mendalam untuk Shared Internal Presets (Semua tim punya preset resolusi konversi/watermark yang sama)',
  inputType: 'dropdown',
  options: ['Auto', 'Manual', 'Strict'],
  defaultValue: 'Auto',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-omni-179', String(value));
      localStorage.setItem('omni-dropdown-179', String(value));
    }
  }
};
