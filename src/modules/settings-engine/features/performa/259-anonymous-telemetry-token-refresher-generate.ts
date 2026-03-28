import type { SettingFeatureDefinition } from '../../types';
export const feature259: SettingFeatureDefinition = {
  id: '259',
  category: 'performa',
  slug: 'anonymous-telemetry-token-refresher-generate',
  label: 'Anonymous Telemetry Token Refresher (Generate token random baru setiap sesi)',
  description: 'Konfigurasi mendalam untuk Anonymous Telemetry Token Refresher (Generate token random baru setiap sesi)',
  inputType: 'text',
  defaultValue: '',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('omni-259-config', String(value));
    }
  }
};
