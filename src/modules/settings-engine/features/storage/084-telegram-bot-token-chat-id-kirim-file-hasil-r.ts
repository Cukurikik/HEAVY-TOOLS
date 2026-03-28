import type { SettingFeatureDefinition } from '../../types';
export const feature084: SettingFeatureDefinition = {
  id: '084',
  category: 'storage',
  slug: 'telegram-bot-token-chat-id-kirim-file-hasil-r',
  label: 'Telegram Bot Token & Chat ID (Kirim file hasil render ke Telegram)',
  description: 'Konfigurasi mendalam untuk Telegram Bot Token & Chat ID (Kirim file hasil render ke Telegram)',
  inputType: 'text',
  defaultValue: '',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('omni-084-config', String(value));
    }
  }
};
