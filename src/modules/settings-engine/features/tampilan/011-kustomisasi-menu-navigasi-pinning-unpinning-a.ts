import type { SettingFeatureDefinition } from '../../types';
export const feature011: SettingFeatureDefinition = {
  id: '011',
  category: 'tampilan',
  slug: 'kustomisasi-menu-navigasi-pinning-unpinning-a',
  label: 'Kustomisasi Menu Navigasi (Pinning / Unpinning alat favorit)',
  description: 'Konfigurasi mendalam untuk Kustomisasi Menu Navigasi (Pinning / Unpinning alat favorit)',
  inputType: 'text',
  defaultValue: '',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('omni-011-config', String(value));
    }
  }
};
