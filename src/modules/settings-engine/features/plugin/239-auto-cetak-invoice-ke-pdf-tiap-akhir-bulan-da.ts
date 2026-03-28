import type { SettingFeatureDefinition } from '../../types';
export const feature239: SettingFeatureDefinition = {
  id: '239',
  category: 'plugin',
  slug: 'auto-cetak-invoice-ke-pdf-tiap-akhir-bulan-da',
  label: 'Auto-Cetak Invoice ke PDF tiap akhir bulan dan kirim via Email',
  description: 'Konfigurasi mendalam untuk Auto-Cetak Invoice ke PDF tiap akhir bulan dan kirim via Email',
  inputType: 'text',
  defaultValue: '',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('omni-239-config', String(value));
    }
  }
};
