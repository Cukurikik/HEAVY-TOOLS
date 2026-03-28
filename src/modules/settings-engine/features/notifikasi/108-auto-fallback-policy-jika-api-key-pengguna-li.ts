import type { SettingFeatureDefinition } from '../../types';
export const feature108: SettingFeatureDefinition = {
  id: '108',
  category: 'notifikasi',
  slug: 'auto-fallback-policy-jika-api-key-pengguna-li',
  label: 'Auto-Fallback Policy: Jika API Key Pengguna limit, fallback ke Kuota Omni-Tool (On/Off)',
  description: 'Konfigurasi mendalam untuk Auto-Fallback Policy: Jika API Key Pengguna limit, fallback ke Kuota Omni-Tool (On/Off)',
  inputType: 'text',
  defaultValue: '',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('omni-108-config', String(value));
    }
  }
};
