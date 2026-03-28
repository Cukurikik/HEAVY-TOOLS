import type { SettingFeatureDefinition } from '../../types';
export const feature068: SettingFeatureDefinition = {
  id: '068',
  category: 'akun',
  slug: 'integrasi-deepgram-api-stt-transkripsi-super',
  label: 'Integrasi Deepgram API (STT / Transkripsi Super Cepat)',
  description: 'Konfigurasi mendalam untuk Integrasi Deepgram API (STT / Transkripsi Super Cepat)',
  inputType: 'text',
  defaultValue: '',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('omni-068-config', String(value));
    }
  }
};
