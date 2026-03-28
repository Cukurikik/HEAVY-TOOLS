import type { SettingFeatureDefinition } from '../../types';
export const feature067: SettingFeatureDefinition = {
  id: '067',
  category: 'akun',
  slug: 'integrasi-midjourney-via-discord-webhook-api',
  label: 'Integrasi Midjourney via Discord Webhook / API pihak ketiga',
  description: 'Konfigurasi mendalam untuk Integrasi Midjourney via Discord Webhook / API pihak ketiga',
  inputType: 'text',
  defaultValue: '',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('omni-067-config', String(value));
    }
  }
};
