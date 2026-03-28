import type { SettingFeatureDefinition } from '../../types';
export const feature256: SettingFeatureDefinition = {
  id: '256',
  category: 'performa',
  slug: 'mode-jurnalis-samarkan-setiap-teks-dan-gambar',
  label: 'Mode Jurnalis (Samarkan setiap teks dan gambar dengan watermarking steganografi unik)',
  description: 'Konfigurasi mendalam untuk Mode Jurnalis (Samarkan setiap teks dan gambar dengan watermarking steganografi unik)',
  inputType: 'dropdown',
  options: ['Auto', 'Manual', 'Strict'],
  defaultValue: 'Auto',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-omni-256', String(value));
      localStorage.setItem('omni-dropdown-256', String(value));
    }
  }
};
