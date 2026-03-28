import type { SettingFeatureDefinition } from '../../types';
export const feature110: SettingFeatureDefinition = {
  id: '110',
  category: 'notifikasi',
  slug: 'endpoint-testing-button-tombol-test-connectio',
  label: 'Endpoint Testing Button (Tombol "Test Connection" untuk semua API Key)',
  description: 'Konfigurasi mendalam untuk Endpoint Testing Button (Tombol "Test Connection" untuk semua API Key)',
  inputType: 'text',
  defaultValue: '',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('omni-110-config', String(value));
    }
  }
};
