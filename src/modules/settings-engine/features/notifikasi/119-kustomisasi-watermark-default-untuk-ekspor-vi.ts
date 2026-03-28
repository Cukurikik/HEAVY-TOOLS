import type { SettingFeatureDefinition } from '../../types';
export const feature119: SettingFeatureDefinition = {
  id: '119',
  category: 'notifikasi',
  slug: 'kustomisasi-watermark-default-untuk-ekspor-vi',
  label: 'Kustomisasi Watermark Default untuk Ekspor Video/PDF (Teks, Gambar, Transparansi)',
  description: 'Konfigurasi mendalam untuk Kustomisasi Watermark Default untuk Ekspor Video/PDF (Teks, Gambar, Transparansi)',
  inputType: 'text',
  defaultValue: '',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('omni-119-config', String(value));
    }
  }
};
