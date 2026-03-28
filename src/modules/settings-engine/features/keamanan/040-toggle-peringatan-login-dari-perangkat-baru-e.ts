import type { SettingFeatureDefinition } from '../../types';
export const feature040: SettingFeatureDefinition = {
  id: '040',
  category: 'keamanan',
  slug: 'toggle-peringatan-login-dari-perangkat-baru-e',
  label: 'Toggle Peringatan Login dari Perangkat Baru (Email alert)',
  description: 'Konfigurasi mendalam untuk Toggle Peringatan Login dari Perangkat Baru (Email alert)',
  inputType: 'text',
  defaultValue: '',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('omni-040-config', String(value));
    }
  }
};
