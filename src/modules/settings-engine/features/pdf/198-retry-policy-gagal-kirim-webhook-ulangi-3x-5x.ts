import type { SettingFeatureDefinition } from '../../types';
export const feature198: SettingFeatureDefinition = {
  id: '198',
  category: 'pdf',
  slug: 'retry-policy-gagal-kirim-webhook-ulangi-3x-5x',
  label: 'Retry Policy (Gagal kirim webhook, ulangi 3x / 5x)',
  description: 'Konfigurasi mendalam untuk Retry Policy (Gagal kirim webhook, ulangi 3x / 5x)',
  inputType: 'text',
  defaultValue: '',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('omni-198-config', String(value));
    }
  }
};
