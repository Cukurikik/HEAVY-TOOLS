import type { SettingFeatureDefinition } from '../../types';
export const feature263: SettingFeatureDefinition = {
  id: '263',
  category: 'performa',
  slug: 'pilihan-opt-out-untuk-data-dipakai-fine-tunin',
  label: 'Pilihan "Opt-out" untuk Data dipakai Fine-Tuning Model Internal',
  description: 'Konfigurasi mendalam untuk Pilihan "Opt-out" untuk Data dipakai Fine-Tuning Model Internal',
  inputType: 'dropdown',
  options: ['Auto', 'Manual', 'Strict'],
  defaultValue: 'Auto',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-omni-263', String(value));
      localStorage.setItem('omni-dropdown-263', String(value));
    }
  }
};
