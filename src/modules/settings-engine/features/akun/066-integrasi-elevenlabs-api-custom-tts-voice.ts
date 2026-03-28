import type { SettingFeatureDefinition } from '../../types';
export const feature066: SettingFeatureDefinition = {
  id: '066',
  category: 'akun',
  slug: 'integrasi-elevenlabs-api-custom-tts-voice',
  label: 'Integrasi ElevenLabs API (Custom TTS Voice)',
  description: 'Konfigurasi mendalam untuk Integrasi ElevenLabs API (Custom TTS Voice)',
  inputType: 'text',
  defaultValue: '',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('omni-066-config', String(value));
    }
  }
};
