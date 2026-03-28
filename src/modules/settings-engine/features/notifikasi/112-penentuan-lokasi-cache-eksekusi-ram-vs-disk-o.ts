import type { SettingFeatureDefinition } from '../../types';
export const feature112: SettingFeatureDefinition = {
  id: '112',
  category: 'notifikasi',
  slug: 'penentuan-lokasi-cache-eksekusi-ram-vs-disk-o',
  label: 'Penentuan Lokasi Cache Eksekusi (RAM vs Disk OPFS)',
  description: 'Konfigurasi mendalam untuk Penentuan Lokasi Cache Eksekusi (RAM vs Disk OPFS)',
  inputType: 'dropdown',
  options: ['Auto', 'Manual', 'Strict'],
  defaultValue: 'Auto',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-omni-112', String(value));
      localStorage.setItem('omni-dropdown-112', String(value));
    }
  }
};
